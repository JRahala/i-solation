
function filter_over(){

	$( "#suggestions .card")
  .filter(function( index ) {
    return true;
  })
    .toggle();
}

    /*
    <button id = 'Over 60' onclick = 'filter_over()'></button>
    <button id = 'Under 30' onclick = 'filter_under()'></button>

    <button id = 'Bad knees' onclick = 'filter_legs()'></button>
    <button id = 'Bad back' onclick = 'filter_back()'></button>

    <button id = 'Large Space' onclick = 'filter_large()'></button>
    <button id = 'Limited Space' onclick = 'filter_small()'></button>
    */