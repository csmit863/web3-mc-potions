// src/components/BrewingStand.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { createTheme } from '@mui/material';
import abi from '../abi';
import Inventory from './Inventory';
import brewingstandimage from "../images/Brewing_stand.png";
import brewin from '../images/brewin.png';

const { ethers } = require('ethers');
//const provider = new ethers.JsonRpcProvider();
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


const theme = createTheme({
    typography: {
      fontFamily: 'Minecraftia, sans-serif'
    },
  });

const BrewingStand = ({ contract, accounts }) => {

    const [fuelLevel, setFuelLevel] = useState(0);
    const [ingredientId, setIngredientId] = useState('');
    const [basePotionId, setBasePotionId] = useState('');
    const [base1, setBase1] = useState('');
    const [base2, setBase2] = useState('');
    const [base3, setBase3] = useState('');
    const [potionQuantity, setPotionQuantity] = useState(1);

    const [blazePowderAmount, setBlazePowderAmount] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [contractInstance, setContractInstance] = useState(null);

    const fetchAddresses = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
        const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddresses(addresses);
        } catch (error) {
        console.error('Error fetching accounts:', error);
        }
    } else {
        console.log('Ethereum object does not exist!');
    }
    };

    useEffect(() => {
    fetchAddresses();
    }, []);



    const getFuelLevel = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);
                setContractInstance(contract)
                const fuelLevel = await contract.checkFuelLevel(); // <<< error occurs here
                setFuelLevel(fuelLevel);
                console.log('Fuel Level Updated');
            } catch (error) {
                console.error('Error brewing potion:', error);
            }
        } else {
            console.log('Ethereum object does not exist!');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
          getFuelLevel();
        }, 1000); 
      
        return () => clearInterval(interval);
      }, []); 
      

      async function brewPotion(ingredientId, baseItemId, quantity) {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const brewingStandContract = new ethers.Contract(contractAddress, abi, signer);
                const tx = await brewingStandContract.brewPotion(ingredientId, baseItemId, quantity);
                await tx.wait();
                console.log('Potion brewed successfully');
            } catch (error) {
                console.error('Error brewing potion:', error);
            }
        } else {
            console.log('Ethereum object does not exist!');
        }
    };
    


    async function addBlazePowder(amount) {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const gameItemsContract = new ethers.Contract(contractAddress, abi, signer);
                const tx = await gameItemsContract.addBlazePowder(amount);
                await tx.wait();
                const newFuelLevel = await gameItemsContract.checkFuelLevel();
                setFuelLevel(newFuelLevel.toString());

                console.log('Blaze powder added successfully');
            } catch (error) {
                console.error('Error adding blaze powder:', error);
            }
        } else {
            console.log('Ethereum object does not exist!');
        }
    };

    const handleAddBlazePowder = async () => {
        await addBlazePowder(blazePowderAmount, setFuelLevel);
    };
    const handleBrew = async () => {
        await brewPotion(ingredientId, basePotionId, potionQuantity);
    };
    

    return (
        <div >
            <Button onClick={getFuelLevel}>Check/Update Fuel Level</Button>
            <Typography variant="h4" gutterBottom>Brewing Stand</Typography>
            <Typography variant="body1">Fuel Level: {fuelLevel.toString()}</Typography>
        <Container style={{
            padding:50,
            backgroundColor: '#ededed',
            border: 'solid 2px black',
            boxShadow: '5px 5px 0px rgba(0, 0, 0, 1)',
            backgroundSize: 'contain',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            width: '100%', 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>

            <div style={{ backgroundImage: `url(${brewin})`, backgroundPosition: 'top center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', display: 'flex', justifyContent: 'center', alignItems: 'top', gap: '20px' }}>
                <Box style={{flex: 1}}>
                    <TextField 
                        style={{backgroundColor:'#adadad', width:50, height:50}}
                        //label=""
                        value={blazePowderAmount}
                        onChange={(e) => setBlazePowderAmount(e.target.value)}
                    />
                    <Button onClick={handleAddBlazePowder} variant="contained">
                        Add Fuel
                    </Button><br/><br/>
                </Box>

                <Box style={{margin:10, flex: 1}}> {/* The Brewing Stand */}
                    <Typography>Ingredient ID</Typography>
                    <TextField 
                        style={{width:50, height:50, backgroundColor:'#adadad'}}
                        value={ingredientId}
                        onChange={(e) => setIngredientId(e.target.value)}
                    />
                    <Typography>Base Potion ID</Typography>
                    <TextField 
                        label="ID"
                        style={{width:50, height:50, backgroundColor:'#adadad'}}
                        value={basePotionId}
                        onChange={(e) => setBasePotionId(e.target.value)}
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        value={potionQuantity}
                        onChange={(e) => setPotionQuantity(e.target.value)}
                        style={{width:100, height:50, backgroundColor:'#adadad'}}
                    />

                
                </Box>
                <Button onClick={handleBrew} variant="contained">Brew Potion</Button>
                
                <br/>

                
            </div>
            <Box >
                <Typography>Inventory of {addresses}</Typography>
                <Inventory contract={contractInstance} accounts={addresses}/>

            </Box>
        </Container>
        </div>
    );
};

export default BrewingStand;
