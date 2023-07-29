import { Plugin,Notice } from "obsidian";

export default class CodeTab extends Plugin {
    async onload() {
        this.registerMarkdownPostProcessor((element,context) => {
            const hasTab:boolean = element.getElementsByClassName('language-tab').length !== 0
            if(!hasTab) return
            
            //create basic skeleton of tab-container
            element.className = 'tab-container'
			//head
            const tabHeadersEl = document.createElement('ul')
            tabHeadersEl.className='tab-headers'
			//content 
            const tabContentsEl = document.createElement('div')
            tabContentsEl.className='tab-contents'

            element.appendChild(tabHeadersEl)
            element.appendChild(tabContentsEl)

            const codeEl = element.querySelector('code')
            if(codeEl !== null) {
                const codeElText = codeEl.innerHTML
				console.log(codeElText)
                const codeElTextParts = codeElText.split('lang:')
				console.log(codeElTextParts)
                for(let i = 1 ; i < codeElTextParts.length; i++) {
                    // fill up tab-headers
                    const language = codeElTextParts[i].substring(0,codeElTextParts[i].indexOf('\n'))
					console.log(language)
                    
					const tabHeaderEl = document.createElement('li')
                    tabHeaderEl.className = 'tab-header'
                    tabHeaderEl.innerHTML = language
                    if(i===1) tabHeaderEl.addClass('tab-header--active')
                    tabHeaderEl.onclick = (e) => handler(e)

                    tabHeadersEl.appendChild(tabHeaderEl);
                    
                    //fill up tab-contents
                    const codeText = codeElTextParts[i].substring(codeElTextParts[i].indexOf('\n')+1)
                    const codeEl = document.createElement('code')
                    codeEl.className = 'language-'+language
                    codeEl.innerHTML = codeText

                    const copyBtn = document.createElement('button')
                    copyBtn.className = 'copy-code-button'
                    copyBtn.innerHTML = 'Copy'
					copyBtn.onclick = (e) => copyHandler(codeText)
                    
					const preEl = document.createElement('pre')
					preEl.className = 'language-'+language
                    preEl.appendChild(codeEl)
                    preEl.appendChild(copyBtn)
					
                    const tabContentEl = document.createElement('div')
					tabContentEl.className = 'tab-content'
                    if(i===1) tabContentEl.addClass('tab-content--active')
                    tabContentEl.appendChild(preEl)

                    tabContentsEl.appendChild(tabContentEl)
                }

            }
            // event handler
            const handler = (e:MouseEvent) => {
				const tabHeaderEls = element.getElementsByClassName('tab-header') 
				const tabContentEls = element.getElementsByClassName('tab-content')
                for(let i = 0; i < tabHeaderEls.length; i++) {
                    if(tabHeaderEls[i] === e.srcElement) {
                        tabHeaderEls[i].classList.add('tab-header--active');
                        tabContentEls[i].classList.add('tab-content--active');
                    } else {
                        tabHeaderEls[i].classList.remove('tab-header--active');
                        tabContentEls[i].classList.remove('tab-content--active');
                    }
                }
            }

			const copyHandler = (text :string) => {
				navigator.clipboard.writeText(text)
				new Notice("Copied to your clipboard")
			}
            // remove old codes
            if(element.firstChild !== null) element.removeChild(element.firstChild)
        })
    }
}