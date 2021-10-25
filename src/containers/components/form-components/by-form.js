// const stringHTML =
// "    <input\n" +
// '            class="mb-3"' +
// '            data-type="address"' +
// '            type="text"\n' +
// '            name="msisdn"\n' +
// '            value=""\n' +
// "    />\n" +
// "    <input\n" +
// '            class="mb-3"' +
// '            data-type="unit"' +
// '            type="number"\n' +
// '            name="amount"\n' +
// '            value=""\n' +
// "    />\n" +
// "    <input\n" +
// '            class="mb-3"' +
// '            data-type="unit"' +
// '            type="number"\n' +
// '            name="rate"\n' +
// '            value=""\n' +
// "    />\n" +
// "    <input\n" +
// '            class="mb-3"' +
// '            data-type="unit"' +
// '            type="number"\n' +
// '            name="price"\n' +
// '            value=""\n' +
// "    />\n" +
// "    <input\n" +
// '            class="mb-3"' +
// '            data-type="unit"' +
// '            type="number"\n' +
// '            name="order"\n' +
// '            value=""\n' +
// "    />\n";

// const sendFrom = () => {
// const elements = formRef.current.elements;
// const data = [];
// const errors = {};

// elements.forEach((item) => {
//   data.push({
//     name: item.name,
//     value: item.value,
//     type: item.dataset.type,
//   });
// });

// data.forEach((item) => {
//   if (!item.value) {
//     errors[item.name] = "Field is rquired";
//   }
// });

// elements.forEach((item) => {
//   const el = document.getElementsByName(item.name)[0];

//   if (!errors.hasOwnProperty(item.name) && el.classList.contains("text-danger")) {
//     el.classList.remove("text-danger");
//     el.nextSibling.remove();
//   }

//   for (const [key, value] of Object.entries(errors)) {
//     if (item.name === key) {
//       if (item.name === key && el.classList.contains("text-danger")) {
//         el.nextSibling.remove();
//       }
//       const message = document.createElement("div");
//       message.innerHTML = `<div class="text-danger mb-3">${value}</div>`;
//       el.classList.add("text-danger");
//       el.after(message);
//     }
//   }
// });
// };

// <form
//       ref={formRef}
//       dangerouslySetInnerHTML={{ __html: stringHTML }}
//     />
//     <button className="btn btn-green btn-sm mb-3" onClick={sendFrom}>
//       Example Button
//     </button>

