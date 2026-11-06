@regression @ui @amazon @search
Feature: Amazon search module
  As an Amazon visitor
  I want to find and sort products
  So that I can explore relevant results

  Background:
    Given I am on Amazon India

  @smoke
  Scenario: Search returns matching products
    When I search for "wireless mouse"
    Then Amazon results should show "wireless mouse"

  Scenario: Search query can be changed
    When I search for "wireless mouse"
    And I search for "wireless keyboard"
    Then Amazon results should show "wireless keyboard"

  Scenario: Search results can be sorted by price
    When I search for "wireless mouse"
    And I sort results by price from low to high
    Then the low-to-high price option should be selected
    And search results should remain available