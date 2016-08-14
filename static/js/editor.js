//editor:

function edit(slug){
    window.slug = slug;
}

var simplemde = new SimpleMDE({ element: document.getElementById("editor") });

$(function(){
    //do it
    
    if (!window.slug){
        window.slug = window.location.href.split('wiki/')[1].split('/')[0];
    }
    
    var url = window.location.origin + '/api/article/' + window.slug;
    
    $('#submit').on('click',function(){
        var md = simplemde.value();
        
        console.log(md);
        
        $.ajax({
            url:url,
            method:"POST",
            data:{markdown:md}
        })
        .done(done)
        .fail(fail);
        
    });
    
    function done(){
        alert('saved');
    }
    function fail(){
        for (var i = 0; i < arguments.length; i ++){
            console.error(arguments[i]);
        }
    }
});