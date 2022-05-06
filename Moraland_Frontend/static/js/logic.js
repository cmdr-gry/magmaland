//Logic.js file
//Initializing constants
const serverUrl = "https://985xrjuqqn5m.usemoralis.com:2053/server";
const appId = "WbFfavh1SwOQlb7zeP3jXMxzmmlxaVVO4HfwJnIJ";
// Graphics constants
// Map management constants
const tiles = 12; // in pixels
const plots = tiles * 9; // in pixels
const roads = tiles * 2; // in pixels
const initialOffsets = plots + (2 * roads);
const plotViewOffsets = 1 * (plots + (2 * roads));

// - canvas and context
const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext('2d');
const plotCanvas = document.getElementById("plotCanvas");
const plotCtx = plotCanvas.getContext('2d');
const worldImage = new Image();

// - State
const mapView = {mapOffsetX:-1*initialOffsets,mapOffsetY:-1*initialOffsets};
const plotView = {plotX:0, plotY:0, locationX:0,locationY:0};

//web3 constants
const ethers = Moralis.web3Library;
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const contractABI = [
    
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name_",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "symbol_",
                    "type": "string"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }]

//web3 functions
async function login(){
    Moralis.Web3.authenticate().then(async function() {
        const chainIdHex = await Moralis.switchNetwork("0x13881");
    });
}

async function assignPlot() {
    const plotID = document.getElementById("plotID").value;
    const assigned = await isPlotAssigned(plotID);
    if (!assigned) {
        const metadata = {
            "PlotID":plotID,
            "PlotX":document.getElementById("plotX").value,
            "PlotY":document.getElementById("plotY").value,
            "LocationX":document.getElementById("locationX").value,
            "LocationY":document.getElementById("locationX").value,
            "image":"https://moralis.io/wp-content/uploads/2021/06/Moralis-Glass-Favicon.svg",
        }
        const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
        await metadataFile.saveIPFS();
        const metadataURI = metadataFile.ipfs();
        await mint(metadataURI);
    }
    else{
        displayMessage("01","Plot is already assigned");
    }
}
async function mint(_tokenURI) {
    const contractOptions = {
        contractAddress: contractAddress,
        abi: contractABI,
        functionName: "assign",
        params: {
            tokenURI:_tokenURI,
            bytesId:document.getElementById("plotID").value
        }
    }
    try{
        const transaction = await Moralis.executeFunction(contractOptions);
        await transaction.wait();
        displayMessage("00","Transaction confirmed with hash "+transaction.hash);
    }
        catch(error){
            displayMessage("01","Transaction reverted see the console for details");
            console.log(error);
        }
    }

async function isPlotAssigned(plotID) {
    const contractOptions = {
        contractAddress: contractAddress,
        abi: contractABI,
        functionName: "exist",
        params: {
            bytesId:plotID
        }
    }
    return await Moralis.executeFunction(contractOptions);
}

Moralis.start({ serverUrl, appId});
login();
// canvas drawing functions
function drawCanvas(){
    mainCanvas.width = 3 * plots + 4 * roads;
    mainCanvas.height = 3 * plots + 4 * roads;
    plotCanvas.width = plots
    plotCanvas.height = plots
    worldImage.src = 'static/img/Magmaland.png';
    worldImage.onload = () => {
      initializeMap()
    }
}

function initializeMap() {
    updatePlotLocation()
    setPlotData();
    drawMapSection(mainCtx,mapView.mapOffsetX,mapView.mapOffsetY);
    drawCursor(plotViewOffsets,plotViewOffsets);
    drawMapSection(plotCtx,-1 * plotView.locationX,-1 *plotView.locationY);
}

function move(direction) {
    const validMove = validateMove(direction);
    if (validMove) {
        updateView(direction);
        updatePlotLocation();
        drawMapSection(mainCtx,mapView.mapOffsetX,mapView.mapOffsetY);
        drawCursor(plotViewOffsets,plotViewOffsets);
        drawMapSection(plotCtx,-1 * plotView.locationX,-1 *plotView.locationY);
        setPlotData();
    }
}
function validateMove(direction) {
    switch(direction){
        case 'ArrowRight': return !(plotView.plotX == 5);
        case 'ArrowUp': return !(plotView.plotY == 0);
        case 'ArrowLeft': return !(plotView.plotX == 0);
        case 'ArrowDown': return !(plotView.plotY == 5);
    }
}

function updateView(direction) {
    switch(direction){
        case 'ArrowRight':
            plotView.plotX += 1;
            mapView.mapOffsetX -= plots + roads;
            updatePlotLocation()
            break
        case 'ArrowDown':
            plotView.plotY += 1;
            mapView.mapOffsetY -= plots + roads;
            updatePlotLocation()
            break
        case 'ArrowLeft':
            plotView.plotX -= 1;
            mapView.mapOffsetX += plots + roads;
            updatePlotLocation()
            break
        case 'ArrowUp':
            plotView.plotY -= 1;
            mapView.mapOffsetY += plots + roads;
            updatePlotLocation();
            break
    }
}
function drawMapSection(ctx,originX,originY){
    ctx.drawImage(worldImage,originX,originY);
}

function drawCursor(x,y) {
    mainCtx.strokeRect(x,y,plots,plots)
}

function updatePlotLocation() {
    plotView.locationX = -1 * mapView.mapOffsetX + plotViewOffsets;
    plotView.locationY = -1 * mapView.mapOffsetY + plotViewOffsets; 
}

function setPlotData() {
    const plotID = ethers.utils.id(JSON.stringify(plotView));
    document.getElementById("plotX").value = plotView.plotX
    document.getElementById("plotY").value = plotView.plotY
    document.getElementById("locationX").value = plotView.locationX
    document.getElementById("locationY").value = plotView.locationY
    document.getElementById("plotID").value = plotID;
    //isPlotAssignable(plotID);
}
    drawCanvas();
    window.addEventListener('keydown' , (e) => {
        move(e.key)
    });