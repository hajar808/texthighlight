(function () {

    var component = {

        name: 'texthighlight',
        version: [1, 0, 0],

        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-24.0.1.js',
        // ccm: '//ccmjs.github.io/ccm/ccm.js',

        config: {
            db: ["ccm.store", { name: 'ccm-texthighlight' }],

            texthighlight: {
                id: 'texthighlight',
                name: createUniqueId(),
                inner: [
                    {
                        tag: 'div',
                        id: 'text',
                        inner: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimataLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '


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


            css: ["ccm.load", "resources/texthighlight.css"]

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
                texthighlight.name = createUniqueId();

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
                            surroundText(color);
                        }else{
                            const mark = getMarkElement();
                            mark.style.background = color;
                            updateComment(mark.id,color,null);

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
                let id = texthighlight.name;

                const text = texthighlight.querySelector('#text');
                getContent(text.innerHTML);
                text.onmouseup = (e) => {
                    handleSelection();
                }
                hideMenu();
                $.setContent(self.element, texthighlight);

                function handleSelection() {

                    shadow = self.element.parentNode;
                    selection = shadow.getSelection();
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

                function surroundText(color) {
                    const mark = document.createElement("mark");
                    mark.style.background = color;
                    mark.id = create_UUID();

                    mark.appendChild(range.extractContents());
                    range.insertNode(mark);
                    selection.removeAllRanges();

                }

                function deleteMark() {
                    if (isAlreadyMarked()) {
                        const elem = getMarkElement();
                        elem.replaceWith(...elem.childNodes);
                        hideMenu();
                        self.db.del(markElement.id);


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
                        getComment(markElement.id);
                    }
                    setMenuPosition();
                    menu.style.visibility = "visible"
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
                    const id = markElement.id;
                    const color = markElement.style.background;
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
                                text.style.background = comment.value.color;
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





                /* function removeDummy() {
                  const elem = document.getElementById('trash');
                  elem.parentNode.removeChild(elem);
                  return false;
                 }*/


            };
            /*  makeDelBtn: function delet(){
                 const delBtn = document.createElement('button');
                 delBtn.textContent = 'Delete';
                 delBtn.className ='delBtn';
                 return delBtn;
              }*/


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