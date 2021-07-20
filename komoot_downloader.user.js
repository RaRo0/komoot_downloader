// ==UserScript==
// @name         Kom00t GPX Downloader
// @version      0.1
// @description  Simpel GPX Downloader for Komoot
// @author       RaRo0
// @match        https://www.komoot.de/tour/*
// @icon         https://www.google.com/s2/favicons?domain=komoot.de

// @grant		unsafeWindow
// ==/UserScript==

(
function() {
        function exportgpx()
        {
            //console.log(kmtBoot.getProps());
            //console.log(kmtBoot.getProps().page.store.moc["//api.komoot.de/v007/tours/"+window.document.location.pathname.split("/")[2]+"/coordinates"]["attributes"]["items"]);
            var rawdata=kmtBoot.getProps().page.store.moc["//api.komoot.de/v007/tours/"+window.document.location.pathname.split("/")[2]+"/coordinates"]["attributes"]["items"];
            var data="<?xml version='1.0' encoding='UTF-8'?>\n"+'<gpx version="1.1">\n';
            var name= kmtBoot.getProps().page.store.moc["//api.komoot.de/v007/tours/"+window.document.location.pathname.split("/")[2]]["changed"]["name"]
            data+=`<metadata><name>${name}</name><author><link href="https://www.komoot.de"><text>komoot</text><type>text/html</type></link></author></metadata>\n`
            data+="<trk><trkseg>\n"
            for(var i = 0;i<rawdata.length;i++)
            {
                data+=' ';
                data+=`<trkpt lat="${rawdata[i]["lat"]}" lon="${rawdata[i]["lng"]}"><ele>${rawdata[i]["alt"]}</ele></trkpt>\n`
            }
            data+="</trkseg></trk></gpx>"
            var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
            
            saveData(blob,name.replaceAll(" ","_")+".gpx")

        }


    function findElement(foundold=-1)
    {

        if (foundold!=-1)
        {
            var startnode=foundold;
        }
        else
        {
            var startnode=document;
        }

        var divTags = startnode.getElementsByTagName("div");
        var searchText = "Shop";
        var found=-1;
        for (var i = 0; i < divTags.length; i++) {

            if (divTags[i].textContent.includes(searchText)  ) {
                found = divTags[i];
                break;
            }
        }
        if (found!=-1)
        {
            findElement(found)
        }
        else
        {
            if(foundold==-1)
            {
                setTimeout(function(){findElement()}, 1000);
                return
            }
            var btn=document.createElement("button");
            btn.innerHTML="Get GPX"
            btn.className="tw-inline-flex tw-justify-center tw-items-center c-btn c-btn--primary-inv";
            btn.style.margin="10px"
            btn.addEventListener("click",exportgpx,false);
            foundold.appendChild(btn);

        }
    }
    var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var url =window.URL.createObjectURL(data);
        a.href =  url
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    }());
   setTimeout(function(){findElement()}, 2000);
}
)();