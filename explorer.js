const express = require('express');
const Web3 = require('web3');

const app = express();
const PORT = 3000;

// Configurar Web3 para conectarse al nodo Ethereum especificado
const web3 = new Web3('http://18.118.78.102:8545');

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Endpoint para obtener información de un bloque por número
app.get('/block/:number', async (req, res) => {
    try {
        const block = await web3.eth.getBlock(req.params.number);
        res.json(block);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Endpoint para obtener información de una transacción por hash
app.get('/transaction/:hash', async (req, res) => {
    try {
        const transaction = await web3.eth.getTransaction(req.params.hash);
        res.json(transaction);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// HTML y JavaScript del frontend en línea
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ethereum Explorer</title>
</head>
<body>
    <h1>Ethereum Block Explorer</h1>
    <form id="blockForm">
        <input type="text" id="blockNumber" placeholder="Enter block number">
        <button type="submit">Get Block</button>
    </form>
    <pre id="blockInfo"></pre>

    <form id="transactionForm">
        <input type="text" id="transactionHash" placeholder="Enter transaction hash">
        <button type="submit">Get Transaction</button>
    </form>
    <pre id="transactionInfo"></pre>

    <script>
        document.getElementById('blockForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const blockNumber = document.getElementById('blockNumber').value;
            const response = await fetch(\`/block/\${blockNumber}\`);
            const block = await response.json();
            document.getElementById('blockInfo').textContent = JSON.stringify(block, null, 2);
        });

        document.getElementById('transactionForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const transactionHash = document.getElementById('transactionHash').value;
            const response = await fetch(\`/transaction/\${transactionHash}\`);
            const transaction = await response.json();
            document.getElementById('transactionInfo').textContent = JSON.stringify(transaction, null, 2);
        });
    </script>
</body>
</html>
`;

// Servir el contenido HTML en la raíz
app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
