
/**
 * @overview ccm component to create highlight and comment text
 * @author hajar menssouri <hajar.menssouri@smail.inf.h-brs.de>, 2020
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * */



(function () {

    var component = {

        name: 'texthighlight',
        version: [1, 0, 0],

        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-24.0.1.js',

        config: {

            db: ["ccm.store", { name: 'ccm-texthighlight',url: "https://ccm2.inf.h-brs.de" }],

            texthighlight: {
                id: 'texthighlight',
                name: createUniqueId(),
                inner: [
                    {
                        tag: 'div',
                        id: 'text',
                        inner: '<h1>Markieren Sie den Text</h1><h1>Die erdrückende Langeweile</h1><p>Von Chris Mills</p><h2>Kapitel 1: Die dunkle Nacht</h2><p>Es war eine dunkle Nacht. Irgendwo hörte man eine Eule rufen. Der Regen strömte herab auf... </p><h2>Kapitel 2: Die ewige Stille</h2><p>Unser Protagonist kann gerade so aus dem Schatten heraus flüstern...</p><h3>Der Geist spricht</h3><p>Nachdem mehrere Stunden der Stille vorbei gegangen waren, setzte sich plötzlich der Geist aufrecht hin und rief "Bitte habt erbarmen mit meiner Seele!"</p>'

                    },
                    {
                        id: 'contextmenu',
                        inner: [
                            {
                                tag: 'div',
                                id: 'menu',
                                inner: [
                                    {
                                        tag: 'button',
                                        id: 'comment',
                                        onclick: '%comment%'

                                    },
                                    {
                                        tag: 'button',
                                        class: 'color-btn',
                                        style: 'background:#F7DC6F',
                                        onclick: '%highlight%'

                                    },
                                    {
                                        tag: 'button',
                                        class: 'color-btn',
                                        style: 'background:lightgreen',
                                        onclick: '%highlight%'
                                    },
                                    {
                                        tag: 'button',
                                        class: 'color-btn',
                                        style: 'background:antiquewhite',
                                        onclick: '%highlight%'

                                    },
                                    {
                                        tag: 'button',
                                        class: 'color-btn',
                                        style: 'background:lavender',
                                        onclick: '%highlight%'

                                    },
                                    {
                                        tag: 'button',
                                        id: 'trash',
                                        onclick: '%remove%'
                                    }

                                ]

                            },
                            {
                                tag: 'div',
                                id: 'comment-container',
                                inner:[
                                    {
                                        tag :'textarea',
                                        id: 'comment-area',
                                        placeholder: 'Enter comment...'

                                    }
                                ]

                            },
                            {
                                tag: 'button',
                                id: 'cancel',
                                inner: 'Cancel',
                                onclick: '%cancel%'


                            },
                            {
                                tag: 'button',
                                id: 'save',
                                inner: 'Save',
                                onclick: '%save%'
                            },
                            {
                                tag: 'button',
                                id: 'edit',


                                onclick: '%edit%'
                            }

                        ]

                    }


                ]
            },


            css: ["ccm.load", "https://hajar808.github.io/texthighlight/resources/texthighlight.css"]

        },

        Instance: function () {

            /**
             * own reference for inner functions
             * @type {Instance}
             */
            const self = this;

            /**
             * shortcut to help functions
             * @type {Object.<string,function>}
             */
            let $;

            /**
             * init is called once after all dependencies are solved and is then deleted
             */
            this.init = async () => {

                // set shortcut to help functions
                $ = this.ccm.helper;

                const texthighlight = $.html(self.texthighlight);

                texthighlight.setAttribute("name",createUniqueId());

            };


            this.start = async () => {

                let shadow;
                let selection;
                let range;
                let markElement;

                const texthighlight = $.html(self.texthighlight, {
                    highlight: function (e) {
                        const button = e.srcElement;
                        const color = button.style.background;
                        if (!isAlreadyMarked()) {
                            const id = create_UUID();
                            addHighlight(id, selection, range, color);
                        }else{
                            const mark = getMarkElement();
                            mark.style.background = color;
                            const id = mark.className;
                            updateComment(id,color,null);

                        }
                        setContent(text.innerHTML);
                        hideMenu();


                    },


                    remove: function (e) {
                        deleteMark();
                        setContent(text.innerHTML);
                    },

                    comment: function (e) {
                        showCommentArea();

                    },

                    cancel: function (e){
                        hideCommentArea();
                        hideMenu();
                    },

                    save: function (e) {
                        saveComment();

                    },
                    edit: function(e){
                        const text =texthighlight.querySelector("#comment-area");
                        const comment = text.value;
                        editComment(comment);
                    }

                });

                let id = texthighlight.getAttribute("name");

                const text = texthighlight.querySelector('#text');
                // init element with current content
                getContent(text.innerHTML);

                if(isTouchScreen()){
                    text.onselectionchange = (e) => {
                        handleSelection();
                    }
                }else{
                    text.onmouseup = (e) => {
                        handleSelection();
                    }
                }

                // hide context menu if text not selected
                hideMenu();

                $.setContent(self.element, texthighlight);

                /**
                 * handle selection to mark
                 */
                function handleSelection() {

                    shadow = self.element.parentNode;
                    if(shadow.getSelection){
                        selection = shadow.getSelection();
                    }else {
                        selection = window.getSelection();
                    }
                    if (selection.rangeCount <= 0){
                        console.log(selection.rangeCount)
                        return;
                    }

                    range = selection.getRangeAt(0);
                    const edit =texthighlight.querySelector("#edit");
                    edit.style.display ="none";
                    if (selection && selection.toString()!== "") {
                        showMenu();

                    }else {
                        if (isAlreadyMarked()) {
                            markElement = getMarkElement();
                            showMenu();
                        } else {

                            hideMenu();
                        }
                    }

                }


                function isTouchScreen(){
                    var hasTouchScreen = false;
                    if ("maxTouchPoints" in navigator) {
                        hasTouchScreen = navigator.maxTouchPoints > 0;
                    } else if ("msMaxTouchPoints" in navigator) {
                        hasTouchScreen = navigator.msMaxTouchPoints > 0;
                    } else {
                        var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
                        if (mQ && mQ.media === "(pointer:coarse)") {
                            hasTouchScreen = !!mQ.matches;
                        } else if ('orientation' in window) {
                            hasTouchScreen = true; // deprecated, but good fallback
                        } else {
                            // Only as a last resort, fall back to user agent sniffing
                            var UA = navigator.userAgent;
                            hasTouchScreen = (
                                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                                /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
                            );
                        }
                    }
                    return hasTouchScreen;
                }


                function surroundMark(color, id, range){
                    const mark = document.createElement("mark");
                    mark.style.backgroundColor = color;
                    mark.classList.add(id);
                    mark.appendChild(range.extractContents());
                    range.insertNode(mark);
                }

                function deleteMark() {
                    if (isAlreadyMarked()) {
                        const elem = getMarkElement();
                        const markId = elem.className;
                        if(!markId){
                            return;
                        }
                        let markList = texthighlight.querySelectorAll("."+ markId);
                        markList.forEach(mark => {
                            mark.replaceWith(...mark.childNodes);
                        })

                        hideMenu();
                        self.db.del(markId);
                    }
                }

                function isAlreadyMarked() {
                    const elem = selection.anchorNode.parentElement;
                    const closeElem = elem.closest('mark');
                    if (elem.nodeName === "MARK" || (closeElem && closeElem.contains(elem))) {
                        return true;
                    } else {
                        return false;
                    }
                }

                function getMarkElement(){
                    const elem = selection.anchorNode.parentElement;
                    const closeElem = elem.closest('mark');
                    if (elem.nodeName === "MARK") {
                        return elem;
                    } else if(closeElem && closeElem.contains(elem)){
                        return closeElem;
                    }
                    return null;
                }

                /**
                 * prepare and show context menu
                 */
                function showMenu(){
                    hideCommentArea();
                    defaultTextArea();
                    const menu = texthighlight.querySelector("#contextmenu");
                    const comment = menu.querySelector("#comment");
                    const trash = menu.querySelector("#trash");
                    if(!isAlreadyMarked()){
                        comment.style.visibility ="hidden";
                        trash.style.visibility ="hidden";
                    }else{
                        comment.style.visibility = "visible";
                        trash.style.visibility = "visible";
                        getComment(markElement.className);
                    }
                    setMenuPosition();
                    menu.style.visibility = "visible";
                }

                function hideMenu(){

                    const menu = texthighlight.querySelector("#contextmenu");
                    const comment = menu.querySelector("#comment");
                    const trash = menu.querySelector("#trash");

                    comment.style.visibility ="hidden";
                    trash.style.visibility ="hidden";
                    menu.style.visibility = "hidden";
                    defaultTextArea();
                    hideCommentArea();
                }

                /**
                 * set menu position top or bottom
                 */
                function setMenuPosition(){
                    const clientRect = range.getBoundingClientRect();
                    const menu = texthighlight.querySelector("#contextmenu");
                    menu.style.left = clientRect.left + "px";
                    const position =(clientRect.bottom -  clientRect.height - menu.clientHeight);
                    if(position< 0){
                        menu.style.top = clientRect.bottom +"px";
                    }else{
                        menu.style.top = (clientRect.bottom -  clientRect.height - menu.clientHeight) + "px";
                    }
                }

                function showCommentArea(){
                    const area = texthighlight.querySelector("#comment-container");
                    const cancel = texthighlight.querySelector("#cancel");
                    const save = texthighlight.querySelector("#save");
                    area.style.display = "block";
                    cancel.style.display = "block";
                    save.style.display = "block";


                }

                function hideCommentArea() {
                    const area = texthighlight.querySelector("#comment-container");
                    const cancel = texthighlight.querySelector("#cancel");
                    const save = texthighlight.querySelector("#save");
                    const text = texthighlight.querySelector("#comment-area")
                    area.style.display = "none";
                    cancel.style.display = "none";
                    save.style.display = "none";
                    text.value = "";


                }

                function setContent(content){

                    self.db.set({key:id,value:content});

                }

                function getContent(content){

                    self.db.get(id).then(
                        existContent=> {
                            if(existContent && existContent.value){
                                text.innerHTML = existContent.value;
                            }else{
                                text.innerHTML = content;
                            }
                        }
                    )

                }

                function saveComment() {
                    const id = markElement.className;
                    const color = markElement.style.backgroundColor;
                    const text = texthighlight.querySelector("#comment-area");
                    const comment = text.value;

                    const commentObject = {
                        color : color,
                        comment : comment
                    }
                    self.db.set({key:id,value:commentObject});
                    hideMenu();

                }

                function getComment(id){
                    self.db.get(id).then(
                        comment =>{
                            if(comment){
                                const text =texthighlight.querySelector("#comment-area");
                                text.value = comment.value.comment;
                                text.style.backgroundColor = comment.value.color;
                                text.readOnly = true;
                                const edit =texthighlight.querySelector("#edit");
                                edit.style.display ="block";

                                const commentBtn = texthighlight.querySelector("#comment");
                                commentBtn.style.visibility ="hidden";

                                showCommentArea();

                                const cancel = texthighlight.querySelector("#cancel");
                                const save = texthighlight.querySelector("#save");
                                cancel.style.display = "none";
                                save.style.display = "none";
                            }else{
                                const edit =texthighlight.querySelector("#edit");
                                edit.style.display ="none";
                            }
                        }
                    )
                }

                function updateComment(id,color,comment) {
                    self.db.get(id).then(
                        result=> {
                            if(result){
                                if(color){
                                    result.value.color = color;
                                }
                                if(comment){
                                    result.value.comment = comment;
                                }
                                self.db.set({key:id,value:result.value});
                            }
                        }
                    )


                }


                function editComment(comment){
                    const text =texthighlight.querySelector("#comment-area");
                    text.value =comment;
                    text.readOnly = false;
                    const edit =texthighlight.querySelector("#edit");
                    edit.style.display ="none";
                    const cancel = texthighlight.querySelector("#cancel");
                    const save = texthighlight.querySelector("#save");
                    cancel.style.display = "block";
                    save.style.display = "block";


                }


                function defaultTextArea(){
                    const text =texthighlight.querySelector("#comment-area");
                    text.value ="";
                    text.style.background = "white";
                    text.readOnly = false;

                }


                function addHighlight(id, selection, range, color){
                    let root = range.commonAncestorContainer;
                    let start = range.startContainer;
                    let end = range.endContainer;

                    let firstElement = start.parentElement;
                    let lastElement = end.parentElement;
                    let nextElement = firstElement.nextElementSibling;

                    // if selected text is not nested then mark directly the text
                    if(start.parentElement === root || root.nodeType === 3 || end.parentElement.contains(start.parentElement)){
                        surroundMark(color, id, range);
                    }else{
                        firstElement = findFirstElement(root, firstElement);
                        nextElement = firstElement.nextElementSibling;
                        // if text is nested then mark recursive first section
                        traverseFirstElement(start, firstElement, color, range.startOffset, false, id );
                        // mark the middle text section
                        while(nextElement !== null && nextElement !== end.parentElement){
                            if(nextElement.contains(end.parentElement)){
                                lastElement = nextElement;
                                break;
                            }
                            traverseMiddleElement(nextElement, color, id);
                            nextElement = nextElement.nextSibling;
                        }
                        // if last element not contains nested element then mark the last section
                        if(end.parentElement === lastElement){
                            traverseLastElement(end, lastElement, color, range.endOffset, id);
                        }else{
                            // if last element contains nested then mark recursive the nested sections
                            traverseDeepElement(end.parentElement, lastElement, color, range.endOffset, id);
                        }

                    }
                    // after mark remove the selection
                    selection.removeAllRanges();

                }

                /**
                 * traverse first element from start selection and mark it
                 * @param start
                 * @param element
                 * @param color
                 * @param startOffset
                 * @param after
                 * @param id
                 * @returns {boolean}
                 */
                function traverseFirstElement(start, element, color, startOffset, after, id) {
                    if(element.nodeType === 3){
                        const originalText = element.textContent;
                        if(start === element){
                            if(isMark(element)){
                                return true;
                            }
                            const markText = originalText.substring(startOffset);
                            const prevText = originalText.substring(0,startOffset);
                            const rootElement = element.parentElement;
                            const mark = markAndReplace(element,markText,color,id);
                            if(prevText){
                                const prevElement = document.createTextNode(prevText);
                                rootElement.insertBefore(prevElement, mark);
                            }
                            return true;
                        }else if(after === undefined || after === true ){
                            if(isMark(element)){
                                return true;
                            }
                            markAndReplace(element, originalText, color, id);
                            return  true;
                        }else{
                            return false;
                        }
                    }
                    for(let i = 0; i< element.childNodes.length ; ++i){
                        after = traverseFirstElement(start, element.childNodes[i], color, startOffset, after, id);
                    }

                }

                /**
                 * traverse middle element of selection and mark it
                 * @param element
                 * @param color
                 * @param id
                 */
                function traverseMiddleElement(element, color, id){
                    if(element.nodeType === 3){
                        if(isMark(element)){
                            return;
                        }
                        const originalText = element.textContent;
                        markAndReplace(element, originalText, color, id);
                        return;
                    }
                    for(let i = 0; i< element.childNodes.length; ++i){
                        traverseMiddleElement(element.childNodes[i], color, id);
                    }
                }

                /**
                 * traverse last element from end selection and mark it
                 * @param end
                 * @param element
                 * @param color
                 * @param endOffset
                 * @param id
                 * @returns {boolean}
                 */
                function traverseLastElement(end, element, color , endOffset, id){
                    if(element.nodeType === 3){
                        const originalText = element.textContent;
                        if(end === element){
                            if(isMark(element)){
                                return false;
                            }
                            const markText = originalText.substring(0,endOffset);
                            const nextText = originalText.substring(endOffset);
                            const mark = markAndReplace(element, markText, color,id);
                            if(nextText){
                                mark.outerHTML += nextText;
                            }
                            return false;
                        }else{
                            if(isMark(element)){
                                return true;
                            }
                            markAndReplace(element, originalText, color, id);
                            return true;
                        }
                    }
                    for( let i=0 ; element.childNodes.length; ++i){
                        let next = traverseLastElement(end, element.childNodes[i], color, endOffset, id);
                        if(next !== undefined && next === false){
                            return ;
                        }
                    }
                }

                /**
                 * * traverse deep element of last element of selection and mark it
                 * @param lastElement
                 * @param element
                 * @param color
                 * @param endOffSet
                 * @param id
                 * @returns {boolean}
                 */
                function traverseDeepElement(lastElement, element, color, endOffSet, id){
                    if(element.nodeType === 3){
                        const originalText = element.textContent;
                        if(element.parentElement ===lastElement){
                            const markText = originalText.substring(0,endOffset);
                            const nextText = originalText.substring(endOffset);
                            const mark = markAndReplace(element, markText, color,id);
                            if(nextText){
                                mark.outerHTML += nextText;
                            }
                            return false;
                        }else{
                            markAndReplace(element, originalText, color, id);
                            return true;
                        }
                    }
                    for(let i= 0; element.childNodes.length; ++i){
                        let next = traverseDeepElement(lastElement, element.childNodes[i], color, endOffSet, id);
                        if(!next){
                            return;
                        }
                    }
                }

                function findFirstElement(container, startElement){
                    let firstElement = startElement;
                    while(firstElement.parentElement !== container){
                        firstElement = firstElement.parentElement;
                    }
                    return firstElement;
                }


                function isMark(e){
                    return e.parentElement.nodeName === "MARK";
                }

                function createMark(text, color, id){
                    let mark = document.createElement("mark");
                    mark.classList.add(id);
                    mark.style.backgroundColor = color;
                    mark.appendChild(document.createTextNode(text));
                    return mark;
                }

                function markAndReplace(e, text, color, id){
                    let mark = createMark(text, color, id);
                    let rootElement = e.parentElement;
                    rootElement.replaceChild(mark, e);
                    return mark;
                }
            };
        }


    };

    function create_UUID(){
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return 'mark-' + uuid;
    }

    function createUniqueId(){
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return 'texthighlight-' + uuid;
    }

    function p() {
        window.ccm[v].component(component)
    }

    var f = "ccm." + component.name + (component.version ? "-" + component.version.join(".") : "") + ".js";
    if (window.ccm && null === window.ccm.files[f]) window.ccm.files[f] = component; else {
        var n = window.ccm && window.ccm.components[component.name];
        n && n.ccm && (component.ccm = n.ccm), "string" == typeof component.ccm && (component.ccm = {url: component.ccm});
        var v = component.ccm.url.split("/").pop().split("-");
        if (v.length > 1 ? (v = v[1].split("."), v.pop(), "min" === v[v.length - 1] && v.pop(), v = v.join(".")) : v = "latest", window.ccm && window.ccm[v]) p(); else {
            var e = document.createElement("script");
            document.head.appendChild(e), component.ccm.integrity && e.setAttribute("integrity", component.ccm.integrity), component.ccm.crossorigin && e.setAttribute("crossorigin", component.ccm.crossorigin), e.onload = function () {
                p(), document.head.removeChild(e)
            }, e.src = component.ccm.url
        }
    }
}());