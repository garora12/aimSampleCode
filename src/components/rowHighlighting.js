import $ from "jquery";

const RowHighlighting = () => {
	// To HighLight Row on click
	let jQselectorParent = "tbody";
	let jQselectorChild = "tr.MuiTableRow-root";
	$(jQselectorParent).off("click", jQselectorChild)
	$(jQselectorParent).on('click', jQselectorChild, function (event) {
		if($(event.target).is( "td" )) {
			if (!$(this).hasClass('highLightedRow')) {
				$(this).addClass('highLightedRow')
			} else {
				if ($($(event.currentTarget).find('input[type=checkbox]')[0]).is(":checkbox")) {
					if ($($(event.currentTarget).find('input[type=checkbox]')[0]).is(":not(:checked)")) {
						$(this).removeClass('highLightedRow')
					}
				} else {
					$(this).removeClass('highLightedRow')
				}
			}
		}
	})
}



export default RowHighlighting
