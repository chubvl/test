var $popupContainer = document.getElementById('popup-container'),
    $popup = $popupContainer.querySelector('.popup-transitionWarning');

$popupContainer.onclick = function () {
    $popupContainer.style.opacity = 0;
    setTimeout(function () {
        $popupContainer.style.display = 'none'
    }, 900);
}
$popup.onclick = function (e) {
    e.stopPropagation();
}

function openPopup() {
    $popupContainer.style.display = 'block';
    setTimeout(function () {
        $popupContainer.style.opacity = 1;
    }, 100);
}

function closePopup() {
    $popupContainer.style.opacity = 0;
    setTimeout(function () {
        $popupContainer.style.display = 'none'
    }, 70);
}