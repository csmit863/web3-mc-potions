import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Tooltip } from '@mui/material';
import blaze_powder from '../images/Blaze_Powder.png';
import netherwart from '../images/netherwart.png';
import spider_eye from '../images/spider_eye.png';
import fermented_spider_eye from '../images/fermented_spider_eye.png';
import golden_carrot from '../images/golden_carrot.png';
import redstone from '../images/redstone.png';
import glowstone from '../images/glowstone.png';
import gunpowder from '../images/gunpowder.png'
import water_bottle from '../images/water_bottle.png';
import strength_potion from '../images/strength_potion.png'
import weakness_potion from '../images/weakness_potion.png'
import phantom_membrane from '../images/phantom_membrane.png';
import slow_falling_potion from '../images/slow_falling_potion.png';

const Inventory = ({ contract, accounts }) => {
    const [items, setItems] = useState([]);
    // Define the array of token IDs based on your smart contract
    const tokenIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 68, 69, 70, 71, 72, 73, 74]; // Add other IDs as needed
    const itemImages = {
        0: blaze_powder, // Blaze Powder
        1: netherwart, 
        2: spider_eye,
        3: fermented_spider_eye,
        4: golden_carrot,
        5: redstone,
        6: glowstone,
        7: gunpowder,
        8: phantom_membrane,
        68: water_bottle,
        69: water_bottle,
        70: water_bottle,
        71: water_bottle,
        72: strength_potion,
        73: weakness_potion,
        74: slow_falling_potion
      };
    const itemNames = { 
        0: "Blaze Powder", 
        1: "Netherwart", 
        2: "Spider Eye",
        3: "Fermented Spider Eye",
        4: "Golden Carrot",
        5: "Redstone",
        6: "Glowstone",
        7: "Gunpowder",
        8: "Phantom Membrane",

        68: "Water Bottle",
        69: "Awkward Potion",
        70: "Mundane Potion",
        71: "Thick Potion",
        72: "Strength Potion",
        73: "Weakness Potion",
        74: "Slow Falling Potion"
     };


    useEffect(() => {
        const loadItems = async () => {
            const itemsWithBalance = [];

            for (const tokenId of tokenIds) {
                const balance = await contract.balanceOf(accounts[0], tokenId);
                if (balance > 0) {
                    itemsWithBalance.push({
                        id: tokenId,
                        name: itemNames[tokenId] || `Item ${tokenId}`,
                        quantity: balance
                    });
                }
            }

            setItems(itemsWithBalance);
        };

        if (contract && accounts.length > 0) {
            loadItems();
        }
    }, [contract, accounts]);

    return (
        <Grid container spacing={0.1}>
            {items.map((item) => (
                <Grid item key={item.id}  >
                    <Tooltip title={(item.name + " (" + item.id + ")")} placement="top">
                    <Card style={{borderRadius:0}}>
                        <CardContent style={{
                            backgroundColor: '#adadad',
                            border: 'solid 2px black',
                            position: 'relative'}}>
                            <img src={itemImages[item.id]} alt={item.name} style={{width:'50px', height:'50px'}}/>
                            <Typography 
                                variant="body2" 
                                style={{ 
                                    position: 'absolute', 
                                    bottom: '10px', 
                                    right: '10px' 
                                }}
                            >{item.quantity.toString()}
                            </Typography>
                        </CardContent>
                    </Card>
                    </Tooltip>
                </Grid>
            ))}
        </Grid>
        
    );
};

export default Inventory;
