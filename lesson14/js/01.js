const request = async (url) => {
    const data = await fetch(url);
    if(data.status >= 200 && data.status < 300){
        return data.json()
    }else {
        throw new Error("Сталась помилка під час виконання запиту за url: " + url)
    }
}

function clickLink (link = '') {
    if(link.includes('character')){
        request(link)
        .then(e => showCharacters(e))
        .catch(e => console.error(e))
    }else if (link.includes('episode')){
        request(link)
        .then(e => showEpisodes(e))
        .catch(e => console.error(e))
    }else if (link.includes('location')){
        request(link)
        .then(e => showLocations(e))
        .catch(e => console.error(e))
    }
}

function showCharacters (data) {
    console.log(data)
    const cards = data.results.map(e => {
    return `
    <div class="charCard">
        <div class="image">
            <img src="${e.image}">
        </div>
        <div class="text">
            <section>
                <div class="name">${e.name}</div>
                <div class="status">${e.status} - ${e.species}</div>
            </section>
            <section>
                <span class="where">Last known location:</span>
                <div class="info">${e.location.name}</div>
            </section>
            <section>
                <span class="where">First seen in:</span>
                <div class="info">${e.origin.name}</div>
            </section>
        </div>
    </div>
    `
    }).join('');
    const main = document.createElement("div")
    main.classList.add("main")
    document.body.append(main)
    const container = document.createElement("div")
    container.classList.add("container")
    main.append(container)
    container.insertAdjacentHTML('beforeend', cards)
    const buttonsDiv = document.createElement("div")
    buttonsDiv.classList.add("buttons")
    container.append(buttonsDiv)
    createButtons(data.info.prev, data.info.next, buttonsDiv, container)
}

function showLocations (data) {   
    console.log(data);
}

function showEpisodes (data) { 
    console.log(data);
}

function createButtons(prev,next, buttonsDiv, container){
    if(prev !== null){
        const button = document.createElement("button")
        button.classList.add("button")
        button.innerText = "Previous page"
        button.onclick = function(){
            container.remove()
            request(prev)   
            .then(e => showCharacters(e))
            .catch(error => console.log(error))
        }
        buttonsDiv.append(button)
    }
    if(next !== null){
        const button = document.createElement("button")
        button.classList.add("button")
        button.innerText = "Next page"
        button.onclick = function(){
            container.remove()
            request(next)
            .then(e => showCharacters(e))
            .catch(error => console.log(error))
        }
        buttonsDiv.append(button)
    }
}

request("https://rickandmortyapi.com/api")
.then(data => {
   const newNavigation =  Object.entries(data).map(el => {
       return addLinkNavigation(el[0], el[1])
    })
    document.getElementById('navigation').append(...newNavigation)
})

class CreateTag {
    constructor(nameTag){
        this.element = document.createElement(nameTag);
    }
}

class CreateNavigation extends CreateTag { 
    constructor(nameTag = 'li', href = '', value = ''){
        super(nameTag)
        if(href !== ''){
            this.element.addEventListener('click', () => {clickLink(href)})
            this.element.dataset.link = href;
        }
        if(value !== ''){
            this.element.innerText = value;
        }
    }
}

function addLinkNavigation (key, value) {
    const li = new CreateNavigation('li');
    li.element.classList.add('item')
    const a = new CreateNavigation('a', value, key)
    li.element.append(a.element)
    return li.element
}