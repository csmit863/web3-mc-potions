// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract BrewingStand is ERC1155, Ownable {

    mapping(bytes32 => uint256) private recipeToPotion;
    mapping(address => uint256) private blazePowderFuel;
    
    //Ingredients
    uint256 public constant BLAZE_POWDER = 0;
    uint256 public constant NETHERWART = 1;
    uint256 public constant SPIDER_EYE = 2;
    uint256 public constant FERMENTED_SPIDER_EYE = 3;
    uint256 public constant GOLDEN_CARROT = 4;
    uint256 public constant REDSTONE = 5; 
    uint256 public constant GLOWSTONE = 6;
    uint256 public constant GUNPOWDER = 7;
    uint256 public constant PHANTOM_MEMBRANE = 8;

    //Potions
    uint256 public constant WATER_BOTTLE = 68;
    uint256 public constant AWKWARD_POTION = 69;
    uint256 public constant MUNDANE_POTION = 70;
    uint256 public constant THICK_POTION = 71;
    uint256 public constant STRENGTH_POTION = 72;
    uint256 public constant WEAKNESS_POTION = 73;
    uint256 public constant SLOW_FALLING_POTION = 73;

    constructor() ERC1155(""){
        _mint(msg.sender, BLAZE_POWDER, 64, "");
        _mint(msg.sender, NETHERWART, 64, "");
        _mint(msg.sender, WATER_BOTTLE, 64, "");
        _mint(msg.sender, SPIDER_EYE, 64, "");
        _mint(msg.sender, FERMENTED_SPIDER_EYE, 64, "");
        _mint(msg.sender, GOLDEN_CARROT, 64, "");
        _mint(msg.sender, REDSTONE, 64, "");
        _mint(msg.sender, GLOWSTONE, 64, "");
        _mint(msg.sender, GUNPOWDER, 64, "");
        _mint(msg.sender, PHANTOM_MEMBRANE, 64, "");

        addRecipe(NETHERWART, WATER_BOTTLE, AWKWARD_POTION);
        addRecipe(SPIDER_EYE, WATER_BOTTLE, MUNDANE_POTION);
        addRecipe(GLOWSTONE, WATER_BOTTLE, THICK_POTION);
        addRecipe(BLAZE_POWDER, AWKWARD_POTION, STRENGTH_POTION);
        addRecipe(FERMENTED_SPIDER_EYE, WATER_BOTTLE, WEAKNESS_POTION);
        addRecipe(PHANTOM_MEMBRANE, AWKWARD_POTION, SLOW_FALLING_POTION);
    }

    function addRecipe(uint256 ingredientId1, uint256 ingredientId2, uint256 potionResultId) public onlyOwner {
        bytes32 recipeHash = keccak256(abi.encodePacked(ingredientId1, ingredientId2));
        recipeToPotion[recipeHash] = potionResultId;
    }

    function brewPotion(uint256 ingredientId, uint256 baseItemId, uint256 quantity) public {
        require(quantity > 0, "Quantity must be greater than zero");
        require(quantity <= 3, "Quantity cannot be greater than 3");
        
        uint256[] memory recipeArray = new uint256[](2);
        recipeArray[0] = ingredientId;
        recipeArray[1] = baseItemId;
        bytes32 recipeHash = keccak256(abi.encodePacked(recipeArray));
        uint256 potionResultId = recipeToPotion[recipeHash];
        
        require(potionResultId != 0, "Recipe does not exist");
        require(blazePowderFuel[msg.sender] >= quantity, "Insufficient blaze powder fuel");
        require(balanceOf(msg.sender, ingredientId) >= quantity, "Insufficient ingredients");
        require(balanceOf(msg.sender, baseItemId) >= quantity, "Insufficient base items");

        // Burn the ingredients and the base items
        _burn(msg.sender, ingredientId, quantity); // Burn quantity units of the ingredient
        _burn(msg.sender, baseItemId, quantity);   // Burn quantity units of the base item
        _burn(msg.sender, BLAZE_POWDER, 1); // Burn quantity units of blaze powder to use the brewing stand

        // Mint the potions
        _mint(msg.sender, potionResultId, quantity, ""); // Mint quantity potions

        // Consume blaze powder fuel
        blazePowderFuel[msg.sender] -= 1;
    }


    function addBlazePowder(uint256 amount) public {
        require(balanceOf(msg.sender, BLAZE_POWDER) >= amount, "Insufficient blaze powder");
        _burn(msg.sender, BLAZE_POWDER, amount);
        blazePowderFuel[msg.sender] += amount*5;
    }

    function checkFuelLevel() public view returns (uint256) {
        return blazePowderFuel[msg.sender];
    }


}