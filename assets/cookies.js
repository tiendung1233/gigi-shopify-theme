addEventListener("load", function() {
    let backdrop = document.getElementById("tinycookie-big-backdrop");
    let modal = document.getElementById("tinycookie-wrapper");

    modal.addEventListener("click", function(event) {
        event.stopPropagation();
    });

    backdrop.addEventListener("click", function() {
        backdrop.style.display = "none"; 
        modal.style.display = "none";
    });
});   