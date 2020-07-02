export default (editor, opt = {}) => {
  const c = opt;
  const dc = editor.DomComponents;

  addType("SpineCardByHuz", { page: "1" });
  
  function addType(type, config) {
    dc.addType(type, {
      isComponent: (el) => {
        if (el.tagName === type.toUpperCase()) {
          return { type: type };
        } else return undefined;
      },
      model: {
        defaults: {
          tagName: type,
        },
        init() {
          // console.log('INIT MODEL');
        },
      },
      view: {
        init({ model }) {
          // console.log('INIT VIEW');
        },
        // Do something with the content once the element is rendered.
        // The DOM element is passed as `el` in the argument object,
        // but you can access it from any function via `this.el`
        onRender({ el }) {
          // console.log(this);
          // root
          el.style.display = "block";

          // container
          const iframeEl = document.createElement("iframe");
          iframeEl.src = `__PACKAGE_HOST__/@editor/${config.page}.html`;
          iframeEl.setAttribute("frameBorder", "0");
          iframeEl.setAttribute("height", "10");
          iframeEl.style.display = "block";
          iframeEl.style.width = "100%";
          iframeEl.style.height = "100%";

          iframeEl.onload = () => {
            // setIframeHeight(iframeEl);
            iframeEl.contentWindow.document.body.onclick = (event) => {
              editor.select(el);
            };
          };
          el.appendChild(iframeEl);

          function getDocHeight(doc) {
            doc = doc || document;
            // stackoverflow.com/questions/1145850/
            var body = doc.body,
              html = doc.documentElement;
            var height = Math.max(
              body.scrollHeight,
              body.offsetHeight,
              html.clientHeight,
              html.scrollHeight,
              html.offsetHeight
            );
            return height;
          }

          function setIframeHeight(ifrm) {
            var doc = ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document;
            ifrm.style.visibility = "hidden";
            // ifrm.style.height = "10px"; // reset to minimal height ...
            // IE opt. for bing/msn needs a bit added or scrollbar appears
            ifrm.style.height = getDocHeight(doc) + "px";
            ifrm.style.visibility = "visible";
          }
        },
      },
    });
  }
};
