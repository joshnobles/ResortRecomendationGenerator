const txtPass = document.querySelector('#Password');
const txtConfirmPass = document.querySelector('#ConfirmPassword');

const btnSubmit = document.querySelector('#BtnRegister');

const errorMsgBox = document.querySelector('#ErrorMessage');

for (const element of [txtPass, txtConfirmPass])
    element.addEventListener('keyup', checkPassMatch);

function checkPassMatch() {
    errorMsgBox.textContent = '';

    let pass = txtPass.value.trim();
    let confirmPass = txtConfirmPass.value.trim();

    if (pass === '' && confirmPass === '')
        return;

    if (pass === confirmPass) {
        errorMsgBox.setAttribute('class', 'text-success');
        errorMsgBox.textContent = 'Passwords match!';

        btnSubmit.disabled = false;
    }
    else {
        errorMsgBox.setAttribute('class', 'text-danger');
        errorMsgBox.textContent = 'Passwords do not match!';

        btnSubmit.disabled = true;
    }
}