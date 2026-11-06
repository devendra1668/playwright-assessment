@regression @ui @amazon @cart
Feature: Amazon cart module
  As an Amazon visitor
  I want to open and review my cart
  So that I can check its current state

  Scenario: Cart opens from the site header
    Given I am on Amazon India
    When I open the cart from the header
    Then the Amazon cart page should be visible

  Scenario: A new anonymous cart is empty
    Given I open the Amazon cart page
    Then the Amazon cart page should be visible
    And the anonymous cart should be empty