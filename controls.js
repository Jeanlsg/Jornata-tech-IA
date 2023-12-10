export default {
    jump: new KeyboardEvent('keydown', {key: 'space', keyCode: 32}),
    dispatch(event) {
        document.dispatchEvent(this[event]);
    }
}