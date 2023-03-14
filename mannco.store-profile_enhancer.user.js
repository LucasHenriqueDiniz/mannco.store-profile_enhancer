// ==UserScript==
// @name         ImproveProfile
// @namespace    https://github.com/LucasHenriqueDiniz
// @version      0.11
// @description  Add button to remove AllBUyOrders, Export BuyOrders and Transactions
// @author       Lucas Diniz
// @match        https://mannco.store/profile
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mannco.store
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @grant        none

// @homepageURL  https://github.com/LucasHenriqueDiniz/mannco.store-profile_enhancer
// @supportURL   https://github.com/LucasHenriqueDiniz/mannco.store-profile_enhancer/issues
// @downloadURL  https://github.com/LucasHenriqueDiniz/mannco.store-profile_enhancer/raw/main/mannco.store-profile_enhancer.user.js
// @updateURL    https://github.com/LucasHenriqueDiniz/mannco.store-profile_enhancer/raw/main/mannco.store-profile_enhancer.user.js


// ==/UserScript==

(function () {

    Type.alert.success('Welcome', '')
    const ButtonStyle = 'word-wrap: break-word; box-sizing: border-box; margin: 0; line-height: inherit; overflow: visible; text-transform: none; -webkit-appearance: button; cursor: pointer; display: flex; justify-content: flex-end; font-family: inherit; text-align: center; border-radius: 2rem; padding: 0.5rem 3rem; font-weight: 700; border: none rgb(255, 255, 255); background-color: rgb(27, 166, 193); color: rgb(255, 255, 255); font-size: 15px; margin-left: 1rem; margin-bottom: 1rem;'
//Remove All BuyOrders
function RemoveAllBuyOrders() {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const overlay = document.createElement("div");
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
      `;
        overlay.textContent = "Removing...";
        document.body.appendChild(overlay);

        const removeBuyOrders = async () => {
            const BuyOrdersNumber = document.querySelector("#tab-history > div:nth-child(2) > div:nth-child(2) > div > div > div.table-responsive.large-cell > table > tbody").childElementCount;

            for (let i = 0; i < BuyOrdersNumber; i++) {
                const currentElement = document.querySelectorAll("tr.boPagination")[i];
                const currentButton = currentElement.children[4].children[2];
                overlay.textContent = `Removing ${currentElement.attributes[2].textContent.trim()}   -   ${i} / ${BuyOrdersNumber}`;
                try {
                    currentButton.click();
                } catch (error) {
                    i++
                }
                await delay(250);
            }
            overlay.remove();
        };

        removeBuyOrders();
    }

//Put the removeAllBuyOrder button
    const RemoveAllBO = document.createElement('button');
    RemoveAllBO.textContent = 'Remove All';
    RemoveAllBO.setAttribute('style', ButtonStyle);
    document.querySelector('#tab-history > div:nth-child(2) > div:nth-child(2) > div > div > div.card-head').appendChild(RemoveAllBO);
//Creates a "Are you sure" hud
    RemoveAllBO.addEventListener('click', () => {
iziToast.question({
    timeout: 10000,
    transitionIn: 'bounceInUp',
    transitionOut: 'bounceInDown',
    layout: 1,
    close: false,
    overlay: true,
    displayMode: 'once',
    id: 'question',
    backgroundColor: 'red',
    iconColor: 'white',
    titleSize: '25',
    titleColor: 'white',
    messageSize: '25',
    zindex: 999,
    title: 'Are you sure you want to remove all Buy Orders?',
    close: true,
    closeOnEscape: true,
    message: '',
    position: 'center',
    buttons: [
        ['<button><b>YES</b></button>', function (instance, toast) {
             RemoveAllBuyOrders()
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

        }, true],
        ['<button>NO</button>', function (instance, toast) {

            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

        }],
    ],
    onClosing: function(instance, toast, closedBy){
        console.info('Closing | closedBy: ' + closedBy);
    },
    onClosed: function(instance, toast, closedBy){
        console.info('Closed | closedBy: ' + closedBy);
    }
});
    })

    const DownloadBO = document.createElement('button');
    DownloadBO.textContent = 'Export';
    DownloadBO.setAttribute('style', ButtonStyle);
    document.querySelector('#tab-history > div:nth-child(2) > div:nth-child(2) > div > div > div.card-head').appendChild(DownloadBO);
//exports tehe table for a excel
    DownloadBO.addEventListener('click', function BuyOrdersExcel() {

       const table = document.querySelector("#tab-history > div:nth-child(2) > div:nth-child(2) > div > div > div.table-responsive.large-cell > table");
       const data = Array.from(table.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));
       const workbook = XLSX.utils.book_new();
       const worksheet = XLSX.utils.aoa_to_sheet(data);
       XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados da Tabela');
       XLSX.writeFile(workbook, 'BuyOrders.xlsx')
       Type.alert.success('Excel Downloaded', 'check your downloads')
    })

    const DownloadTransaction = document.createElement('button');
    DownloadTransaction.textContent = 'Export';
    DownloadTransaction.setAttribute('style', ButtonStyle);
    document.querySelector("#tab-history > div:nth-child(1) > div:nth-child(2) > div > div > div.card-head").appendChild(DownloadTransaction);
//loop through value and transform to excel
    DownloadTransaction.addEventListener('click', function BuyOrdersExcel() {
var ValorColocado = 0;

iziToast.info({
    timeout: 15000,
    overlay: true,
    displayMode: 'once',
    id: 'inputs',
    zindex: 999,
    title: 'How many pages you want to download?',
    message: '1 page = 10 items',
    position: 'center',
    drag: false,
    inputs: [
        [
            '<input type="number">',
            'keyup', // change to 'keyup' event listener
            function (instance, toast, input, e) {
                ValorColocado = parseInt(input.value); // update the ValorColocado variable with the input value
            }
        ]
    ],
    buttons: [
        ['<button><b>Confirm</b></button>', function (instance, toast) {
            console.log(ValorColocado)
            DownloadTransc(ValorColocado)
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }, true],
    ],
    onClosing: function(instance, toast, closedBy){
        console.info('Closing | closedBy: ' + closedBy);
    },
});

    })
function DownloadTransc(value) {

var paginationString = document.querySelector("#TransacPagination > li.page-item.active > a").attributes[2].textContent;
const MaxAbas = paginationString.match(/.*\D(\d+)\).*/)[1];
const QuantAbas = value + 2;
const data = [];

// criar o elemento do overlay
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
overlay.style.display = "flex";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.zIndex = "9999";

// criar o elemento do círculo
const circle = document.createElement("div");
circle.style.width = "50px";
circle.style.height = "50px";
circle.style.borderRadius = "50%";
circle.style.border = "5px solid white";
circle.style.animation = "spin 1s linear infinite";

// adicionar o círculo ao overlay
overlay.appendChild(circle);

// adicionar o overlay ao DOM
document.body.appendChild(overlay);

function waitForLoad(selector) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      }
    }, 2000);
  });
}

(async () => {
  for (let x = 2; x < QuantAbas; x++) {
    const table = await waitForLoad("#transacContent");
    const rows = table.querySelectorAll("tr");
    for (let i = 0; i < 10; i++) {
      const row = rows[i];
      const cols = row.querySelectorAll("td");

      const rowData = [];
      for (let j = 0; j < cols.length; j++) {
        rowData.push(cols[j].textContent.trim());
      }
      data.push(rowData);

      if (i == 9) {
        Type.createPagination(10, x, "TransacPagination", "", MaxAbas);
      }
    }
  }
  console.log(data);
  // remover o overlay após a execução do script
  overlay.remove();
const workbook = XLSX.utils.book_new();

// Convert the array to a worksheet
const worksheet = XLSX.utils.aoa_to_sheet(data);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

// Write the workbook to a file
XLSX.writeFile(workbook, 'inventory.xlsx');
Type.alert.success('Excel Downloaded', 'check your downloads')
})();
}
})();
