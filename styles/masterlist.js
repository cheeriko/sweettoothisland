// Spreadsheet import
var url = "https://spreadsheets.google.com/feeds/list/" + sheetID + "/" + sheetPage + "/public/values?alt=json";

// Pagination controls
var perPage = 24;
var currentPage = 1;

// Spreadsheet object
var values = [];

// Page URL Junk
var pageURL = window.location.href;
var designID = pageURL.split('=')[1];

// Template for the character cards
var cardTemplate = function(id, image, owner) {
  return { 
    id,
    image,
    owner,
    htmlTemplate: function htmlTemplate() {
      return `
      <div class="col-lg-3 col-md-4 col-6 p-3">
        <a href="${pageURL}?entry?=${this.id}" class="card d-block overflow-hidden mb-2">
					<div style="

						padding-top: 100%;
						background-image: url(${this.image});
						background-size: contain;
						background-position: center;
						background-repeat: no-repeat;">

					</div>
        </a>
        <a href="${pageURL}?entry?=${this.id}" class="btn btn-primary btn-sm d-block mb-2">${this.id}</a>
        <a class="btn btn-secondary btn-sm d-block">${this.owner}</a>
      </div>
      `
    }
  }
};

// Retrieves sheet info and parses it into an object
// Outputs first page of entries
$.getJSON(url, function (data) {
  var output = "";
  $.each(data.feed.entry, function (index, value) {
    values.push({
      id:         value.gsx$id.$t,
      image:      value.gsx$image.$t,
      owner:      value.gsx$owner.$t,
      artist:     value.gsx$artist.$t,
      designer:   value.gsx$designer.$t,
      worth:      value.gsx$worth.$t,
      status:     value.gsx$status.$t,
      cooldown:   value.gsx$cooldown.$t,
      designtype: value.gsx$designtype.$t,
      bodymods:   value.gsx$bodymods.$t,
      tails:      value.gsx$tails.$t,
      horns:      value.gsx$horns.$t,
      material:   value.gsx$material.$t,
      toppings:   value.gsx$toppings.$t,
      notes:      value.gsx$notes.$t
    });
    if(index < perPage && !pageURL.includes('?=')) {
      var tempItems = cardTemplate(value.gsx$id.$t, value.gsx$image.$t, value.gsx$owner.$t);
      output += tempItems.htmlTemplate();
    }
  });
  
  $(".masterlist-entries").append(output);
  
});


// Pagination functions
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    changePage();
  }
}

function nextPage() {
  if (currentPage < numPages()) {
    currentPage++;
    changePage();
  }
}

// Outputs info on the rest of the pages when you click the next/back
function changePage() {
  $(".masterlist-entries").html("");
  var start = (currentPage - 1) * perPage;
  var output = values.slice(start, start + perPage).reduce(function (s, e) {
      var paginateTempItems = cardTemplate(e.id, e.image, e.owner);
      return s += paginateTempItems.htmlTemplate();
  }, "");
  $(".masterlist-entries").append(output);
}

function numPages() {
  return Math.ceil(values.length / perPage);
}

// Outputs the single card based on the URL
function singleCards() {
  if (pageURL.includes('?=')) {
    newValues = values; 
    $(".masterlist-entries").html("");
    var output = "";
    for (i = 0; i <= Object.keys(newValues).length; i++) {
    	if (i == designID.replace(/[^0-9]/g,'')) {
    		var id = i - 1;
    		output = `
    		<div class="col-12 my-auto">
      		<div class="card p-2 overflow-hidden">
            <h2 class="card-header text-center">${newValues[id].id}</h2>
              <div class="row no-gutters g-0 p-2">
                <div class="col-md-6 my-auto p-4">
                  <div style="
                  
                    height: 300px;
                    background-image: url( ${newValues[id].image});
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;">
                    
                  </div>
                </div>
                <div class="col-md-6 p-4">

                  <div class="d-flex justify-content-between mb-2">
                    <b>Owner</b>` + newValues[id].owner + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Artist</b>` + newValues[id].artist + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Designer</b>` + newValues[id].designer + `
                  </div>
                                    
                  <hr>

                  <div class="d-flex justify-content-between mb-2">
                    <b>Worth</b>` + newValues[id].worth + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Status</b>` + newValues[id].status + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Cooldown</b>` + newValues[id].cooldown + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Design Type</b>` + newValues[id].designtype + `
                  </div>
                                    
                  <hr>

                  <div class="d-flex justify-content-between mb-2">
                    <b>Body Mods</b>` + newValues[id].bodymods + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Tails</b>` + newValues[id].tails + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Horns</b>` + newValues[id].horns + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Material</b>` + newValues[id].material + `
                  </div>
                  
                  <div class="d-flex justify-content-between mb-2">
                    <b>Toppings</b>` + newValues[id].toppings + `
                  </div>
                                    
                  <hr>
                  
                  <div>
                    <b>Notes</b>
                    <div class="ps-2">` + newValues[id].notes + `</div>
                  </div>

                </div> 
              </div>  
            </div> 
          </div>
    		`
    	}
    }
    $(".masterlist-entries").append(output);
  }
}

// Removes the page-nav so nothing gets messed up if it's clicked while on a card
if (pageURL.includes('?=')) {
  $(".next-prev-btns").removeClass('d-flex').hide();
  $(".back-btns").show();
}else{
  $(".back-btns").hide();
}

// Loading Junk
$(".masterlist-entries").addClass("hidden");
$("body").addClass("spinner");

function slowMode(){
  return $(".masterlist-entries").removeClass("hidden").addClass("visible"),
         $("body").removeClass('spinner');
}

// Makes sure the info is loaded before showing the user
setTimeout(singleCards, 2000); 
setTimeout(slowMode, 2500);
