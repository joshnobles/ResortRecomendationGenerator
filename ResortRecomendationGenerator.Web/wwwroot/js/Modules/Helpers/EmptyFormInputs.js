function emptyFormInputs(formElement) {
    const elements = formElement.elements;

    formElement.reset();

    for (const e of elements) {
        const type = e.type.toLowerCase();

        if (type === 'text' || type === 'number' || type === 'password')
            e.value = '';
        else if (type === 'checkbox' || type === 'radio')
            e.checked = false;
    }
}

export default emptyFormInputs;