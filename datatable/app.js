(function() {
    "use strict";

    let objJson, api = "https://restcountries.eu/rest/v2/all";
    let oReq = new XMLHttpRequest();
    oReq.open("GET", api);
    oReq.responseType = 'json';
    oReq.send();

    function DataTable() {
        const prevButton = document.getElementById('button_prev');
        const nextButton = document.getElementById('button_next');
        const clickPageNumber = document.querySelectorAll('.clickPageNumber');
        const updateCount = document.getElementById('update_count');
        const filterData = document.getElementById('filter_data');
        const showingOutOf = document.getElementById('showing_out_of');
        const listingTable = document.getElementById('listingTable');

        let current_page = 1;
        let records_per_page = 5;

        this.init = function() {
            changePage(1);
            pageNumbers();
            selectedPage();
            clickPage();
            addEventListeners();
        };

        let addEventListeners = function() {
            prevButton.addEventListener('click', prevPage);
            nextButton.addEventListener('click', nextPage);
            updateCount.addEventListener('change', updateCountFn);
            filterData.addEventListener('keyup', filterDataFn);
        };

        let selectedPage = function() {
            let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber');
            for (let i = 0; i < page_number.length; i++) {
                if (i == current_page - 1) {
                    page_number[i].style.opacity = "1.0";
                }
                else {
                    page_number[i].style.opacity = "0.5";
                }
            }
        };

        let checkButtonOpacity = function() {
            current_page == 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
            current_page == numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
        };

        let changePage = function(page, result) {
            let data;
            if(result){
                data = result;
            } else {
                data = objJson;
            }

            if (page < 1) {
                page = 1;
            }
            if (page > (numPages() -1)) {
                page = numPages();
            }

            let newRow, tableRef = listingTable.getElementsByTagName('tbody')[0];
            tableRef.innerHTML = "";

            for(var i = (page -1) * records_per_page; i < (page * records_per_page) && i < data.length; i++) {
                newRow = tableRef.insertRow(tableRef.rows.length);
                newRow.innerHTML += `<td><img width="50px" src="${data[i].flag}" /> </td> <td> ${data[i].name} </td><td> ${data[i].capital} </td><td> ${data[i].region} </td><td> ${data[i].population} </td>`;
            }
            checkButtonOpacity();
            selectedPage();

            showingOutOf.innerHTML = "";
            showingOutOf.innerHTML += `<span>Showing ${records_per_page} out of</span> ${objJson.length} <span>entries</span>`;
        };

        let prevPage = function() {
            if(current_page > 1) {
                current_page--;
                changePage(current_page);
            }
        };

        let nextPage = function() {
            if(current_page < numPages()) {
                current_page++;
                changePage(current_page);
            }
        };

        let clickPage = function() {
            document.addEventListener('click', function(e) {
                if(e.target.nodeName == "SPAN" && e.target.classList.contains("clickPageNumber")) {
                    current_page = e.target.textContent;
                    changePage(current_page);
                }
            });
        };

        let pg = function (c, m) {
            var current = c,
                last = m,
                delta = 4,
                left = current - delta,
                right = current + delta + 1,
                range = [],
                rangeWithDots = [],
                l;

            for (let i = 1; i <= last; i++) {
                if (i == 1 || i == last || i >= left && i < right) {
                    range.push(i);
                }
            }
            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }
            return rangeWithDots;
        };

        let pageNumbers = function() {
            let pageNumber = document.getElementById('page_number');
            pageNumber.innerHTML = "";
            let numPagesCount = numPages() + 1;
            let len = (pg(current_page, numPagesCount)).length;

            for (let i=0;i<len;i++){
                pageNumber.innerHTML += `<span class='clickPageNumber'> ${pg(current_page, numPagesCount)[i]} </span>`;
            }

        };

        let numPages = function() {
            return Math.ceil(objJson.length / records_per_page);
        };
        
        let updateCountFn = function (e) {
            records_per_page = e.target.value;
            changePage(current_page);
        };

        let filterDataFn = function (e) {
            let result = [];
            if(e.target.value){
                result = objJson.filter(
                    function(obj) {
                        return Object.keys(obj).some(function(key) {
                            if(key == "name" || key == "capital" || key == "region"){
                                return obj[key].includes(e.target.value);
                            }
                        })
                    }
                );
            }else {
                result='';
            }
            changePage(current_page, result);
        }
    }

    let dataTable = new DataTable();
    oReq.onload = function() {
        objJson = this.response;
        dataTable.init();
    };

})();
