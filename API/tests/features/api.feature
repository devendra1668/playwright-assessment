@regression @api
Feature: Parallel-safe order API chaining
  As an API client
  I want to create an order and reuse its returned ID
  So that dependent requests work while scenarios run in parallel

  Background:
    Given the isolated order API is ready

  @smoke
  Scenario: Retrieve an order using the ID returned by its create request
    When I create an order and save its ID
    Then the order ID should be saved from the create response
    When I fetch the order by its saved ID
    Then the fetched order should match the created order

  Scenario: Confirm an order using the ID returned by its create request
    When I create an order and save its ID
    And I confirm the order using its saved ID
    When I fetch the order by its saved ID
    Then the fetched order should be confirmed

  Scenario: Reject an order with invalid details
    When I submit an order with invalid details
    Then the API should reject the order details

  Scenario: Return not found for an unknown order ID
    When I fetch an order ID that does not exist
    Then the API should return an order not found response

  Scenario: Reject unsupported status without changing the order
    When I create an order and save its ID
    And I attempt an unsupported status for the saved order
    Then the API should reject the status update
    When I fetch the order by its saved ID
    Then the order status should remain created