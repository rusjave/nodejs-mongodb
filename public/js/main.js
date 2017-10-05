$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);

});

function deleteUser(){
	var confirmation = confirm('Are you Sure?');

	if(confirmation){
		$.ajax({
			type:'Delete',
			url: '/users/delete/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
		window.location.replace('/');
	}else {
		return false;
	}
}