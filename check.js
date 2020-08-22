const guildLink = "http://api.wynncraft.com/public_api.php?action=guildStats&command="

async function activityGuild(name = "Titans Valor") {
    let guild = await (await fetch(guildLink + name)).json()
    return Promise.all(guild.members.map((member) => fetch(`http://api.wynncraft.com/v2/player/${member.uuid}/stats`)))
        .then((res) => {
            return Promise.all(res.map((individualres) => individualres.json()))

        }).then((jsons) => {
            return jsons.map((player, i) => {
                return [guild.members[i].name, (Date.now() - Date.parse(player.data[0].meta.lastJoin)) / 1000 / 60 / 60 / 24]
            })
        })
}

async function update() {
    let area = document.querySelector("#players")
    area.innerHTML = ""
    let activity = await activityGuild(document.querySelector("#guildInput").value);
    activity.sort((a, b) => b[1] - a[1])
    activity.forEach((e) => {
        let elm = document.createElement("p")
        elm.innerText = e[0] + " " + e[1] + " days"
        area.appendChild(elm)
    })

}
