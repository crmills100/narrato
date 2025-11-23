// src/engine/GameEngine.js - Core game logic
export const gameEngine = {
  initializeVariables(variableDefinitions) {
    const variables = {};
    for (const [name, definition] of Object.entries(variableDefinitions)) {
      variables[name] = definition.initial_value;
    }
    return variables;
  },

  evaluateConditions(conditions, variables, inventory) {
    if (!conditions || !Array.isArray(conditions)) return true;
    
    return conditions.every(condition => {
      switch (condition.type) {
        case 'variable':
          return this.evaluateVariableCondition(condition, variables);
        case 'inventory':
          return this.evaluateInventoryCondition(condition, inventory);
        case 'random':
          return Math.random() < (condition.probability || 0.5);
        default:
          return true;
      }
    });
  },

  evaluateVariableCondition(condition, variables) {
    const value = variables[condition.variable];
    const target = condition.value;

    switch (condition.operator) {
      case '==': return value === target;
      case '!=': return value !== target;
      case '<': return value < target;
      case '>': return value > target;
      case '<=': return value <= target;
      case '>=': return value >= target;
      case 'contains': return String(value).includes(String(target));
      default: return true;
    }
  },

  evaluateInventoryCondition(condition, inventory) {
    switch (condition.operator) {
      case 'has': return inventory.includes(condition.item);
      case 'not_has': return !inventory.includes(condition.item);
      default: return true;
    }
  },

  processEffects(effects, variables, inventory) {
    let newVars = { ...variables };
    let newInventory = [...inventory];

    if (effects.set_variables) {
      Object.assign(newVars, effects.set_variables);
    }

    if (effects.modify_variables) {
      for (const [varName, modification] of Object.entries(effects.modify_variables)) {
        const currentValue = newVars[varName] || 0;
        switch (modification.operation) {
          case 'add':
            newVars[varName] = currentValue + modification.value;
            break;
          case 'subtract':
            newVars[varName] = currentValue - modification.value;
            break;
          case 'multiply':
            newVars[varName] = currentValue * modification.value;
            break;
          default:
            newVars[varName] = modification.value;
        }
      }
    }

    if (effects.add_inventory) {
      newInventory = [...newInventory, ...effects.add_inventory];
    }

    if (effects.remove_inventory) {
      newInventory = newInventory.filter(item => !effects.remove_inventory.includes(item));
    }

    return { newVars, newInventory };
  },
};
