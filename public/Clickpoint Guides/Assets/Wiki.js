function WikiLinkClick(TheLink){
    sendEventToUnreal("WikiLinkClicked", { ThePage: TheLink});
}

function InjectWikiLinks(wikiListJsonString){
    try{
        const ul = document.createElement("ul");

        wikiListJsonString.sites.forEach(site => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = site.name;
            a.onclick = () => WikiLinkClick(site.uRL);

            if(site.visited){
                a.classList.add("visited");
            }

            const em = document.createElement("em");
            em.textContent = site.description;

            li.appendChild(a);
            li.appendChild(document.createTextNode(" - "));
            li.appendChild(em);

            ul.appendChild(li);
        });

        const wikiLinksElement = document.getElementById("WikiLinks");
        wikiLinksElement.innerHTML = "";
        wikiLinksElement.appendChild(ul);
    }catch (e){
        const errorP = document.createElement("p");
        errorP.className = "err";
        errorP.textContent = "Error Loading Data";
        
        const wikiLinksElement = document.getElementById("WikiLinks");
        wikiLinksElement.innerHTML = "";
        wikiLinksElement.appendChild(errorP);
    }
}