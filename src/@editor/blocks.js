export default function (editor, opt) {
  const c = opt;
  const bm = editor.BlockManager;

  bm.add("SpineCardByHuz", {
    label: "SpineCardByHuz",
    category: "Huz Component",
    content: { type: "SpineCardByHuz" },
    attributes: { class: "gjs-fonts gjs-f-b1" },
  });
}