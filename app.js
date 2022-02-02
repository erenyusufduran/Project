// Storage Controller
const storageController = (function () {

})();

// Element Controller
const ElementController = (function () {

    // private
    const Element = function (id, date, pair, timeframe, shortLong, entry, tp, sl, size, wl, link, reasons, results, r, profit) {
        this.id = id;
        this.date = date;
        this.pair = pair;
        this.timeframe = timeframe;
        this.shortLong = shortLong;
        this.entry = entry;
        this.tp = tp;
        this.sl = sl;
        this.size = size;
        this.r = r;
        this.profit = profit;
        this.wl = wl;
        this.link = link;
        this.reasons = reasons;
        this.results = results;
    }
    var data = {
        elements: [],
        selectedElement: null,
        totalProfit: 0,
        totalR: 0
    }

    // public
    return {
        getElements: function () {
            return data.elements;
        },
        getData: function () {
            return data;
        },
        rCalculator: function (elements) {
            elements.forEach((element) => {
                let _r;
                if (element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == 'LONG') {
                    _r = ((element.tp - element.entry) / (element.entry - element.sl)).toFixed(2);
                } else {
                    _r = ((element.entry - element.tp) / (element.sl - element.entry)).toFixed(2);
                }
                if (element.wl.toUpperCase() == "L" || element.wl.toUpperCase() == "LOSE") {
                    _r = -1;
                }
                element.r = parseFloat(_r);
                return element.r;
            });
        },
        profitCalculator: function (elements) {
            elements.forEach((element) => {
                let _profit;
                if (element.wl.toUpperCase() == "W" || element.wl.toUpperCase() == "WIN") {
                    if (element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == "LONG") {
                        _profit = ((element.tp - element.entry) * element.size - (element.entry * element.size / 5000) - (element.tp * element.size / 2500)).toFixed(2);
                    } else {
                        _profit = ((element.entry - element.tp) * element.size - (element.entry * element.size / 5000) - (element.tp * element.size / 2500)).toFixed(2);
                    }
                } else {
                    if (element.shortLong.toUpperCase() == "S" || element.shortLong.toUpperCase() == "SHORT") {
                        _profit = ((element.entry - element.sl) * element.size - (element.entry * element.size / 5000) - (element.sl * element.size / 2500)).toFixed(2);
                    } else {
                        _profit = ((element.sl - element.entry) * element.size - (element.entry * element.size / 5000) - (element.sl * element.size / 2500)).toFixed(2);
                    }
                }
                element.profit = parseFloat(_profit);
                return element.profit;
            });
        },
        addElement: function (date, pair, timeframe, shortLong, entry, tp, sl, size, wl, link, reasons, results, r, profit) {
            let id;
            if (data.elements.length > 0) {
                id = data.elements[data.elements.length - 1].id + 1;
            } else {
                id = 0;
            }
            const newElement = new Element(id, date, pair, timeframe, shortLong, parseFloat(entry), parseFloat(tp), parseFloat(sl), parseFloat(size), wl, link, reasons, results, parseFloat(r), parseFloat(profit));
            data.elements.push(newElement);
            return newElement;
        },
        getTotalR: function () {
            let _totalR = 0;
            data.elements.forEach(function(element) {
                _totalR += element.r;
            });
            data.totalR = _totalR;
            return data.totalR
        },
        getTotalProfit: function() {
            let _totalProfit = 0;
            data.elements.forEach(function(element) {
                _totalProfit += element.profit;
            });
            data.totalProfit = _totalProfit;
            return data.totalProfit;
        }
    }
})();

// UI Controller
const UIController = (function () {

    const Selectors = {
        elementList: "#item-list",
        addButton: "#addBtn",
        elementCard: "#elementCard",
        elementDate: "#date",
        elementPair: "#pair",
        elementTimeframe: "#timeframe",
        elementShortLong: "#shortLong",
        elementEntry: "#entry",
        elementTP: "#tp",
        elementSL: "#sl",
        elementSize: "#size",
        elementWL: "#wl",
        elementLink: "#link",
        elementReasons: "#reasons",
        elementResults: "#results",
        totalR: '#totalR',
        totalProfit: '#totalProfit'

    }


    return {
        createElementList: function (elements) {
            let html = ``;

            elements.forEach(element => {

                let wL;
                if (element.wl.toUpperCase() == "W" || element.wl.toUpperCase() == "WIN") {
                    wL = "fas fa-check text-success";
                } else {
                    wL = "fas fa-times text-danger";
                }
                let shortLongFontAwesome;
                if(element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == "LONG") {
                    shortLongFontAwesome = "fas fa-arrow-alt-circle-up text-success";
                } else {
                    shortLongFontAwesome = "fas fa-arrow-alt-circle-down text-danger";
                }

                html +=
                    `
                <tr>
                        <td>${element.id}</td>
                        <td>${element.date}</td>
                        <td>${element.pair}</td>
                        <td>${element.timeframe}</td>
                        <td><a><i class="${shortLongFontAwesome}"></i></a></td>
                        <td>${element.entry}</td>
                        <td>${element.tp}</td>
                        <td>${element.sl}</td>
                        <td>${element.size}</td>
                        <td>${element.r}</td>
                        <td>${element.profit}</td>
                        <td><a href="#"<i class="${wL}"></i></a></td>
                        <td><a href="${element.link}" target="_blink"><i class="fas fa-link"></i></a></td>
                        <td>${element.reasons}</td>
                        <td>${element.results}</td>
                        <td>
                            <button type="submit" class="btn btn-warning btn-sm float-right mr-3"><i class="far fa-edit p-1"></i></button>
                        </td>
                    </tr>
                `;
            });
            document.querySelector(Selectors.elementList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addElement: function (element) {

            document.querySelector(Selectors.elementCard).style.display = 'block';

            let wL;
            if (element.wl.toUpperCase() == "W" || element.wl.toUpperCase() == "WIN") {
                wL = "fas fa-check text-success";
            } else {
                wL = "fas fa-times text-danger";
            }
            let shortLongFontAwesome;
            if(element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == "LONG") {
                shortLongFontAwesome = "fas fa-arrow-alt-circle-up text-success";
            } else {
                shortLongFontAwesome = "fas fa-arrow-alt-circle-down text-danger";
            }

            var item =
                `
                <tr>
                    <td>${element.id}</td>
                    <td>${element.date}</td>
                    <td>${element.pair}</td>
                    <td>${element.timeframe}</td>
                    <td><a><i class="${shortLongFontAwesome}"></i></a></td>
                    <td>${element.entry}</td>
                    <td>${element.tp}</td>
                    <td>${element.sl}</td>
                    <td>${element.size}</td>
                    <td>${element.r}</td>
                    <td>${element.profit}</td>
                    <td><a href="#"<i class="${wL}"></i></a></td>
                    <td><a href="${element.link}" target="_blink"><i class="fas fa-link"></i></a></td>
                    <td>${element.reasons}</td>
                    <td>${element.results}</td>
                    <td>
                        <button type="submit" class="btn btn-warning btn-sm float-right mr-3"><i class="far fa-edit p-1"></i></button>
                    </td>
                </tr>
            `;
            document.querySelector(Selectors.elementList).innerHTML += item;
        },
        clearInputs: function () {
            document.querySelector(Selectors.elementDate).value = '';
            document.querySelector(Selectors.elementPair).value = '';
            document.querySelector(Selectors.elementTimeframe).value = '';
            document.querySelector(Selectors.elementShortLong).value = '';
            document.querySelector(Selectors.elementEntry).value = '';
            document.querySelector(Selectors.elementTP).value = '';
            document.querySelector(Selectors.elementSL).value = '';
            document.querySelector(Selectors.elementSize).value = '';
            document.querySelector(Selectors.elementWL).value = '';
            document.querySelector(Selectors.elementLink).value = '';
            document.querySelector(Selectors.elementReasons).value = '';
            document.querySelector(Selectors.elementResults).value = '';
        },
        hideCard: function () {
            document.querySelector(Selectors.elementCard).style.display = 'none';
        },
        showTotal: function(totalR,totalProfit) {
            document.querySelector(Selectors.totalR).textContent = totalR;
            document.querySelector(Selectors.totalR).textContent += "R";

            document.querySelector(Selectors.totalProfit).textContent = totalProfit;
            document.querySelector(Selectors.totalProfit).textContent += "$";

        }
    }
})();

// App Controller
const App = (function (ElementCtrl, UICtrl) {

    const UISelectors = UICtrl.getSelectors();

    // load Event Listeners
    const loadEventListeners = function () {
        // add element event
        document.querySelector(UISelectors.addButton).addEventListener('click', elementAddSubmit);
    }
    const elementAddSubmit = function (e) {

        const elementDate = document.querySelector(UISelectors.elementDate).value;
        const elementPair = document.querySelector(UISelectors.elementPair).value;
        const elementTimeframe = document.querySelector(UISelectors.elementTimeframe).value;
        const elementShortLong = document.querySelector(UISelectors.elementShortLong).value;
        const elementEntry = document.querySelector(UISelectors.elementEntry).value;
        const elementTP = document.querySelector(UISelectors.elementTP).value;
        const elementSL = document.querySelector(UISelectors.elementSL).value;
        const elementSize = document.querySelector(UISelectors.elementSize).value;
        const elementWL = document.querySelector(UISelectors.elementWL).value;
        const elementLink = document.querySelector(UISelectors.elementLink).value;
        const elementReasons = document.querySelector(UISelectors.elementReasons).value;
        const elementResults = document.querySelector(UISelectors.elementResults).value;
        var r;
        if (elementShortLong.toUpperCase() == "L" || elementShortLong.toUpperCase() == 'LONG') {
            if (elementWL.toUpperCase() == "L" || elementWL.toUpperCase() == "LOSE") {
                r = -1;
            } else {
                r = ((elementTP - elementEntry) / (elementEntry - elementSL)).toFixed(2);
            }
        } else {
            if (elementWL.toUpperCase() == "L" || elementWL.toUpperCase() == "LOSE") {
                r = -1;
            } else {
                r = ((elementEntry - elementTP) / (elementSL - elementEntry)).toFixed(2);
            }
        }
        var profit;
        if (elementWL.toUpperCase() == "W" || elementWL.toUpperCase() == "WIN") {
            if (elementShortLong.toUpperCase() == "L" || elementShortLong.toUpperCase() == "LONG") {
                profit = ((elementTP - elementEntry) * elementSize - (elementEntry * elementSize / 5000) - (elementTP * elementSize / 2500)).toFixed(2);
            } else {
                profit = ((elementEntry - elementTP) * elementSize - (elementEntry * elementSize / 5000) - (elementTP * elementSize / 2500)).toFixed(2);
            }
        } else {
            if (elementShortLong.toUpperCase() == "S" || elementShortLong.toUpperCase() == "SHORT") {
                profit = ((elementEntry - elementSL) * elementSize - (elementEntry * elementSize / 5000) - (elementSL * elementSize / 2500)).toFixed(2);
            } else {
                profit = ((elementSL - elementEntry) * elementSize - (elementEntry * elementSize / 5000) - (elementSL * elementSize / 2500)).toFixed(2);
            }
        }
        if (elementPair !== '' && elementShortLong !== '' && elementEntry !== '' && elementTP !== '' && elementSL !== '' && elementSize !== '') {
            const newElement = ElementCtrl.addElement(elementDate, elementPair, elementTimeframe, elementShortLong, elementEntry, elementTP, elementSL, elementSize, elementWL, elementLink, elementReasons, elementResults, r, profit);
            UIController.addElement(newElement);
            const totalR = ElementCtrl.getTotalR();
            const totalProfit = ElementCtrl.getTotalProfit();
            UICtrl.showTotal(totalR,totalProfit);
            UIController.clearInputs();
        }
        e.preventDefault();
    }

    return {
        init: function () {
            console.log("Starting App..");
            const elements = ElementCtrl.getElements();
            if (elements.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createElementList(elements);
                ElementCtrl.rCalculator(elements);
                ElementCtrl.profitCalculator(elements);
            }
            loadEventListeners();

        }
    }
})(ElementController, UIController)

App.init();