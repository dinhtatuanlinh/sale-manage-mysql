let detail = document.getElementById("detail");
let select_cus = (url) => {
    let ajaxFunc = () => {
        return new Promise((res, rej) => {
            let xhtml = new XMLHttpRequest();
            xhtml.open('GET', `https://${url}`, false);
            xhtml.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhtml.send();
            let result = xhtml.response;
            result = JSON.parse(result);
            res(result)
        })
    }
    ajaxFunc().then(data => {
        let html = `
        <form method="POST" action="customer-data/edit/${data.id}">
        <div class="info">
            <div class="name">Name: ${data.name}</div>
            <div class="email">Email: ${data.email}</div>
            <div class="phone">Phone:${data.phone}</div>
        </div>
        <div class="track">
            <div class="tag">Tag: <span>${data.tags}</span></div>
            <div class="url">Url: <span>${data.url}</span></div>
            <div class="location">Location: <span>${data.location}</span></div>
        </div>
        <div class="other">
            <div class="time">Date: <span>${data.createdtime}</span></div>
            <select name="status" class="status">
                <option value="thuebao">Thuê bao</option>
                <option value="khongnghe">Không nghe</option>
                <option value="mayban">Máy bận</option>
                <option value="addzalo">Add zalo</option>
                <option value="tiemnang">Tiềm năng</option>
            </select>
            
        </div>

        <div class="note"><textarea name="note"cols="30" rows="10">${data.note}</textarea></div>
        <button type="submit">Save</button>
        </form>
        `;
        detail.innerHTML = html;
    })
}