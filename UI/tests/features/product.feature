@regression @ui @amazon @product
Feature: Amazon product module
  As an Amazon visitor
  I want to inspect a product and return to my results
  So that product browsing is straightforward

  Background:
    Given I search Amazon for "wireless mouse"

  Scenario: Search result opens its product details
    When I open the first search result
    Then the selected product title should be visible

  Scenario: Product details include the main image
    When I open the first search result
    Then the main product image should be visible

  Scenario: Browser back returns to the same search results
    When I open the first search result
    And I return to the search results
    Then the search query should still be "wireless mouse"