const createElement = (tagName, attributes) => {
    const element = document.createElement(tagName);

    for (const key in attributes) {
        if (key == 'textContent')
            element.textContent = attributes[key];
        else
            element.setAttribute(key, attributes[key]);
    }

    return element;
}

export default createElement;