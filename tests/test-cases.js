// This file contains a set of test cases for the enemy targeting system.
// Each test case consists of an input scenario and the expected output.
const testCases = [
    // Basic Protocol Tests (Single Protocol)
    {
      name: "closest-enemies: Multiple targets, varying distances",
      input: {
        protocols: ["closest-enemies"],
        scan: [
          { coordinates: {x: 0, y: 80}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 5, y: 10}, enemies: {type: "soldier", number: 5} },  // Closest
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8} }
        ]
      },
      expected: {x: 5, y: 10}
    },
    {
      name: "furthest-enemies: Multiple targets, varying distances",
      input: {
        protocols: ["furthest-enemies"],
        scan: [
          { coordinates: {x: 0, y: 80}, enemies: {type: "soldier", number: 10} },  // Furthest
          { coordinates: {x: 5, y: 10}, enemies: {type: "soldier", number: 5} },
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8} }
        ]
      },
      expected: {x: 0, y: 80}
    },
    {
      name: "assist-allies: Only prioritize points with allies",
      input: {
        protocols: ["assist-allies"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 10, y: 20}, enemies: {type: "soldier", number: 5}, allies: 2 },  // Has allies
          { coordinates: {x: 30, y: 30}, enemies: {type: "mech", number: 8} }
        ]
      },
      expected: {x: 10, y: 20}
    },
    {
      name: "avoid-crossfire: Skip targets with allies",
      input: {
        protocols: ["avoid-crossfire"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10} },  // No allies
          { coordinates: {x: 10, y: 20}, enemies: {type: "soldier", number: 5}, allies: 2 },
          { coordinates: {x: 30, y: 30}, enemies: {type: "mech", number: 8} }  // No allies
        ]
      },
      expected: {x: 0, y: 40}  // First target without allies
    },
    {
      name: "prioritize-mech: Attack mechs first",
      input: {
        protocols: ["prioritize-mech"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 10, y: 20}, enemies: {type: "mech", number: 5} },  // Mech target
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8} }
        ]
      },
      expected: {x: 10, y: 20}
    },
    {
      name: "avoid-mech: Skip mech targets",
      input: {
        protocols: ["avoid-mech"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10} },  // Not mech
          { coordinates: {x: 10, y: 20}, enemies: {type: "mech", number: 5} },
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8} }  // Not mech
        ]
      },
      expected: {x: 0, y: 40}  // First non-mech target
    },
  
    // Combined Protocol Tests
    {
      name: "closest-enemies + avoid-mech: Closest non-mech target",
      input: {
        protocols: ["closest-enemies", "avoid-mech"],
        scan: [
          { coordinates: {x: 0, y: 80}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 5, y: 10}, enemies: {type: "mech", number: 5} },  // Closest but mech
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8} }  // Closer non-mech
        ]
      },
      expected: {x: 30, y: 30}
    },
    {
      name: "furthest-enemies + prioritize-mech: Furthest mech if available",
      input: {
        protocols: ["furthest-enemies", "prioritize-mech"],
        scan: [
          { coordinates: {x: 0, y: 80}, enemies: {type: "soldier", number: 10} },  // Furthest but not mech
          { coordinates: {x: 5, y: 10}, enemies: {type: "mech", number: 5} },  // Mech but not furthest
          { coordinates: {x: 70, y: 70}, enemies: {type: "mech", number: 8} }  // Furthest mech
        ]
      },
      expected: {x: 70, y: 70}
    },
    {
      name: "assist-allies + avoid-mech: Allies position without mechs",
      input: {
        protocols: ["assist-allies", "avoid-mech"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10}, allies: 3 },  // Allies with soldiers
          { coordinates: {x: 10, y: 20}, enemies: {type: "mech", number: 5}, allies: 2 },  // Allies with mechs
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8} }  // No allies
        ]
      },
      expected: {x: 0, y: 40}
    },
    {
      name: "closest-enemies + assist-allies: Closest point with allies",
      input: {
        protocols: ["closest-enemies", "assist-allies"],
        scan: [
          { coordinates: {x: 0, y: 80}, enemies: {type: "soldier", number: 10}, allies: 1 },  // Far with allies
          { coordinates: {x: 5, y: 10}, enemies: {type: "mech", number: 5} },  // Closest but no allies
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8}, allies: 2 }  // Closer with allies
        ]
      },
      expected: {x: 30, y: 30}
    },
    {
      name: "avoid-crossfire + prioritize-mech: Mech target without allies",
      input: {
        protocols: ["avoid-crossfire", "prioritize-mech"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "mech", number: 10}, allies: 3 },  // Mech but has allies
          { coordinates: {x: 10, y: 20}, enemies: {type: "soldier", number: 5} },  // No allies but not mech
          { coordinates: {x: 30, y: 30}, enemies: {type: "mech", number: 8} }  // Mech with no allies
        ]
      },
      expected: {x: 30, y: 30}
    },
  
    // Edge Cases
    {
      name: "No valid targets - All beyond range",
      input: {
        protocols: ["closest-enemies"],
        scan: [
          { coordinates: {x: 0, y: 101}, enemies: {type: "soldier", number: 10} },  // > 100 distance
          { coordinates: {x: 120, y: 120}, enemies: {type: "mech", number: 5} }  // > 100 distance
        ]
      },
      expected: null  // No valid targets
    },
    {
      name: "No valid targets - All filtered by protocols",
      input: {
        protocols: ["avoid-mech", "assist-allies"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "mech", number: 10} },  // Mech, excluded
          { coordinates: {x: 10, y: 20}, enemies: {type: "mech", number: 5} }  // Mech, excluded
        ]
      },
      expected: null  // All targets filtered out
    },
    {
      name: "Empty scan array",
      input: {
        protocols: ["closest-enemies"],
        scan: []
      },
      expected: null  // No targets
    },
    {
      name: "Zero enemies",
      input: {
        protocols: ["closest-enemies"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 0} }
        ]
      },
      expected: {x: 0, y: 40}  // Still a valid position to attack
    },
    {
      name: "Exactly at maximum range (100m)",
      input: {
        protocols: ["furthest-enemies"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 100, y: 0}, enemies: {type: "soldier", number: 5} },  // Exactly 100 distance
          { coordinates: {x: 0, y: 99}, enemies: {type: "soldier", number: 8} }
        ]
      },
      expected: {x: 100, y: 0}  // At maximum range, still valid
    },
  
    // Special Protocol Combinations
    {
      name: "All protocols compatible - complex scenario",
      input: {
        protocols: ["closest-enemies", "assist-allies", "avoid-mech"],
        scan: [
          { coordinates: {x: 0, y: 80}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 5, y: 10}, enemies: {type: "mech", number: 5} },  // Closest but mech
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8}, allies: 3 },  // Has allies
          { coordinates: {x: 15, y: 15}, enemies: {type: "soldier", number: 2} }  // Closer than 30,30 but no allies
        ]
      },
      expected: {x: 30, y: 30}  // Closest position with allies and not mech
    },
    {
      name: "prioritize-mech with no mechs available",
      input: {
        protocols: ["prioritize-mech"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 10, y: 20}, enemies: {type: "soldier", number: 5} }
        ]
      },
      expected: {x: 0, y: 40}  // Default to first target when no mechs
    },
    {
      name: "avoid-crossfire when all positions have allies",
      input: {
        protocols: ["avoid-crossfire"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10}, allies: 1 },
          { coordinates: {x: 10, y: 20}, enemies: {type: "soldier", number: 5}, allies: 2 }
        ]
      },
      expected: null  // No valid targets due to crossfire risk
    },
  
    // Very large data sets
    {
      name: "Many targets with various protocols",
      input: {
        protocols: ["closest-enemies", "prioritize-mech"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 10, y: 20}, enemies: {type: "mech", number: 5} },
          { coordinates: {x: 30, y: 30}, enemies: {type: "soldier", number: 8} },
          { coordinates: {x: 5, y: 5}, enemies: {type: "mech", number: 3} },  // Closest mech
          { coordinates: {x: 50, y: 50}, enemies: {type: "soldier", number: 15} },
          { coordinates: {x: 35, y: 35}, enemies: {type: "mech", number: 9} },
          { coordinates: {x: 45, y: 45}, enemies: {type: "soldier", number: 12} },
          { coordinates: {x: 25, y: 25}, enemies: {type: "mech", number: 7} }
        ]
      },
      expected: {x: 5, y: 5}  // Closest mech
    },
  
    // Extreme coordinate values
    {
      name: "Negative coordinates",
      input: {
        protocols: ["closest-enemies"],
        scan: [
          { coordinates: {x: -30, y: -40}, enemies: {type: "soldier", number: 10} },  // Closest
          { coordinates: {x: -50, y: -50}, enemies: {type: "soldier", number: 5} }
        ]
      },
      expected: {x: -30, y: -40}
    },
    {
      name: "Mixed positive/negative coordinates",
      input: {
        protocols: ["furthest-enemies"],
        scan: [
          { coordinates: {x: -30, y: 40}, enemies: {type: "soldier", number: 10} },
          { coordinates: {x: 50, y: -50}, enemies: {type: "soldier", number: 5} },  // Furthest
          { coordinates: {x: 20, y: -20}, enemies: {type: "soldier", number: 8} }
        ]
      },
      expected: {x: 50, y: -50}
    },
  
    // Protocol Combinations with Varied Enemy Types
    {
      name: "assist-allies + prioritize-mech: Allies with mechs get priority",
      input: {
        protocols: ["assist-allies", "prioritize-mech"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "mech", number: 10} },  // Mech but no allies
          { coordinates: {x: 10, y: 20}, enemies: {type: "soldier", number: 5}, allies: 2 },  // Allies but no mech
          { coordinates: {x: 30, y: 30}, enemies: {type: "mech", number: 8}, allies: 3 }  // Both allies and mech
        ]
      },
      expected: {x: 30, y: 30}
    },
  
    // Test with extreme enemy numbers
    {
      name: "Very large enemy count",
      input: {
        protocols: ["closest-enemies"],
        scan: [
          { coordinates: {x: 0, y: 40}, enemies: {type: "soldier", number: 10000} },
          { coordinates: {x: 10, y: 10}, enemies: {type: "soldier", number: 5} }  // Closest
        ]
      },
      expected: {x: 10, y: 10}  // Number of enemies doesn't affect selection
    }
  ];
  
  // Export the test cases for use in automated testing
  module.exports = testCases;