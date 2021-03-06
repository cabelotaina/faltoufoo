$(function() {

    $("#add").on('submit', function(evnt) {
        var error = false;
        if (!$("#when").val()) {
            $("#when-group").addClass("has-error");
            $(".when-help").removeClass("hidden");
            error = true;
        }
        if (!$("#where-lat").val() || !$("#where-lon").val()) {
            $("#where-group").addClass("has-error");
            $(".where-help").removeClass("hidden");
            error = true;
        }
        if (error) {
            return false;
        }
        $.ajax({
            url: '/add',
            type: 'PUT',
            sucess: function(result) {
            },
            data: {lon: $( "#where-lon" ).val(), lat: $( "#where-lat" ).val(), when: $("#when").val()}
        });
    });

    var cache = {};
    $("#where").autocomplete({
         minLength: 2,
         source: function( request, response ) {
             var term = request.term;
             if ( term in cache ) {
                 response( cache[ term ] );
                 return;
             }
             var searchurl = "http://open.mapquestapi.com/nominatim/v1/search?format=json&q="+$("#where").val();
             $.get(searchurl, function(data) {
                 locations = [];
                 $.each(data, function(index, obj) {
                     locations.push(obj);
                 })
                 cache[ term ] = locations;
                 response( locations );
             });
         },
         focus: function( event, ui ) {
             $( "#where" ).val( ui.item.display_name);
             return false;
         },
         select: function( event, ui ) {
             $( "#where-lon" ).val( ui.item.lon);
             $( "#where-lat" ).val( ui.item.lat);
             return false;
         }

    }).autocomplete( "instance" )._renderItem = function( ul, item ) {
         return $( "<li>" ).append( "<a>" + item.display_name + "</a>" ).appendTo( ul );
    };

    $("#when").datepicker({ minDate: -7, maxDate: "+0D" });
    $("#when").datepicker( "option", "dateFormat", 'dd/mm/yy' );
});
