(function () {

    var component = {

        name: 'texthighlight',
        version: [1, 0, 0],

        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-24.0.1.js',
        // ccm: '//ccmjs.github.io/ccm/ccm.js',

        config: {

            texthighlight: {
                id: 'texthighlight',
                inner: [
                    {
                        tag: 'div',
                        id: 'text',
                        inner: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata'


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
                                        inner: 'Comment'
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
                                        inner: 'Delete',
                                        onclick: '%remove%'
                                    }

                                ]

                            }
                        ]

                    }


                ]
            },


            css: ["ccm.load", "texthighlight.css"]

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

            };


            this.start = async () => {
                let shadow;
                let selection;
                let range;


                const texthighlight = $.html(self.texthighlight, {
                    highlight: function (e) {
                        const button = e.srcElement;
                        const color = button.style.background;
                        if (!isAlreadyMarked()) {
                            surroundText(color);
                        }else{
                            const mark = getMarkElement();
                            mark.style.background = color;

                        }



                    },
                    remove: function (e) {
                        deleteMark();
                    }

                });

                const text = texthighlight.querySelector('#text');
                text.onmouseup = (e) => {
                    handleSelection();
                }
                $.setContent(self.element, texthighlight);

                function handleSelection() {

                    shadow = self.element.parentNode;
                    selection = shadow.getSelection();
                    if (selection) {
                        range = selection.getRangeAt(0);
                        console.log(selection.toString());

                    }

                }

                function surroundText(color) {
                    const mark = document.createElement("mark");
                    mark.style.background = color;
                    mark.appendChild(range.extractContents());
                    range.insertNode(mark);
                    selection.removeAllRanges();

                }

                function deleteMark() {
                    if (isAlreadyMarked()) {
                        const elem = getMarkElement();
                        elem.replaceWith(...elem.childNodes);


                    }
                }

                function isAlreadyMarked() {
                    // Parent element von selektiertem text
                    const elem = selection.anchorNode.parentElement;
                    // Am nächsten vorhandene mark element von selektiertem text
                    const closeElem = elem.closest('mark');
                    // wenn parent element mark element ist dann ist es markiert
                    // wenn selektierte Text in closeElem ist dann ist es auch markiert
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
