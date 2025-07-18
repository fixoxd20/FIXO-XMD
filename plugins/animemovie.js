const cheerio = require('cheerio')
const axios = require('axios')
    
async function kuso(q) {
  query = encodeURIComponent(q)
  return new Promise(async function(resolve, reject) {
  
   let res = await axios.get('https://kusonime.com/?s='+query)

   const $ = await cheerio.load(res.data);
   const linkanime1 = await $('div[class="content"] > h2 > a');
   let link1 = await linkanime1.attr('href');
   console.log(link1)
   if (!link1) return reject({ status: 404, message: `Anime ${q} Tidak Ditemukan!` })
   
   let _res = await axios.get(link1)
   let links360 = await [];
   let links480 = await [];
   let links720 = await [];
   let links1080 = await [];
   const $$ = await cheerio.load(_res.data);
   const rootContent = $$('div[class="venser"]')
   const rootBody = rootContent.find('div[class="lexot"]')
   const rootInfo = rootBody.children('div[class="info"]')

   await $$('.dlbod > .smokeddl > .smokeurl > a').each(async (index, value) => {
       let link360 = await $$(value).attr('href');
       await links360.push({link360});
   });
   
   await $$('.dlbod > .smokeddl > .smokeurl + .smokeurl > a').each(async (index, value) => {
       let link480 = await $$(value).attr('href');
       await links480.push({link480});
   });
   
   await $$('.dlbod > .smokeddl > .smokeurl + .smokeurl + .smokeurl > a').each(async (index, value) => {
       let link720 = await $$(value).attr('href');
       await links720.push({link720});
   });
   
   await $$('.dlbod > .smokeddl > .smokeurl + .smokeurl + .smokeurl + .smokeurl > a').each(async (index, value) => {
       let link1080 = await $$(value).attr('href');
       await links1080.push({link1080});
   });
   
   let judul = await $$('div[class="post-thumb"] > h1[class="jdlz"]').text();
   let genre = await $$('div[class="info"] > p:nth-child(2)').text();
   let totaleps = await $$('div[class="info"] > p:nth-child(7)').text();
   let durasi = await $$('div[class="info"] > p:nth-child(9)').text();
   let tglrilis = await $$('div[class="info"] > p:nth-child(10)').text();
   let result360 = await JSON.stringify(links360).replace(/,/g, '\n').replace(/"/g, '').replace(/link360/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '');
   let result480 = await JSON.stringify(links480).replace(/,/g, '\n').replace(/"/g, '').replace(/link480/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '');
   let result720 = await JSON.stringify(links720).replace(/,/g, '\n').replace(/"/g, '').replace(/link720/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '');
   let result1080 = await JSON.stringify(links1080).replace(/,/g, '\n').replace(/"/g, '').replace(/link1080/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '');
   let thumb = $$('div[class="post-thumb"] > img').attr('src')
   let desk = $$('div[class="venser"]').find('div[class="lexot"]').children('p').first().text()
   let type  = $$(rootInfo.children('p').get(4)).text().split(':')[1].trim()
   let rate = $$(rootInfo.children('p').get(7)).text().split(':')[1].trim()
   let status = $$(rootInfo.children('p').get(5)).text().split(':')[1].trim()
   let producer = $$(rootInfo.children('p').get(3)).text().split(':')[1].trim()

   // Newsletter context info
   const _0x273817 = {
     'mentionedJid': [], // Empty since we don't have sender info here
     'forwardingScore': 0x3e7,
     'isForwarded': true,
     'forwardedNewsletterMessageInfo': {
       'newsletterJid': '120363292876277898@newsletter',
       'newsletterName': "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
       'serverMessageId': 0x8f
     }
   };

   resolve({ 
     judul, 
     thumb, 
     desk, 
     genre: genre.split(': ')[1], 
     status, 
     produser: producer, 
     rate, 
     type, 
     link: link1, 
     total_eps: totaleps.split(': ')[1], 
     durasi: durasi.split(': ')[1], 
     tgl_rilis: tglrilis.split(': ')[1], 
     result: { 
       360: [...new Set(result360.replace(/:/g, '').replace(/https\/\//g, 'https://').split('\n'))], 
       480: [...new Set(result480.replace(/:/g, '').replace(/https\/\//g, 'https://').split('\n'))], 
       720: [...new Set(result720.replace(/:/g, '').replace(/https\/\//g, 'https://').split('\n'))], 
       1080: [...new Set(result1080.replace(/:/g, '').replace(/https\/\//g, 'https://').split('\n'))] 
     },
     contextInfo: _0x273817 // Adding the context info to the response
   })
  })
}

async function kuso2(url) {
  return new Promise(async function(resolve, reject) {
    let _res = await axios.get(url)
    let links360 = await [];
    let links480 = await [];
    let links720 = await [];
    let links1080 = await [];
    const $$ = await cheerio.load(_res.data);
    const rootContent = $$('div[class="venser"]')
    const rootBody = rootContent.find('div[class="lexot"]')
    const rootInfo = rootBody.children('div[class="info"]')

    await $$('.dlbod > .smokeddl > .smokeurl > a').each(async (index, value) => {
        let link360 = await $$(value).attr('href');
        await links360.push({link360});
    });
    
    await $$('.dlbod > .smokeddl > .smokeurl + .smokeurl > a').each(async (index, value) => {
        let link480 = await $$(value).attr('href');
        await links480.push({link480});
    });
    
    await $$('.dlbod > .smokeddl > .smokeurl + .smokeurl + .smokeurl > a').each(async (index, value) => {
        let link720 = await $$(value).attr('href');
        await links720.push({link720});
    });
    
    await $$('.dlbod > .smokeddl > .smokeurl + .smokeurl + .smokeurl + .smokeurl > a').each(async (index, value) => {
        let link1080 = await $$(value).attr('href');
        await links1080.push({link1080});
    });
    
    let judul = await $$('div[class="post-thumb"] > h1[class="jdlz"]').text();
    let genre = await $$('div[class="info"] > p:nth-child(2)').text();
    let totaleps = await $$('div[class="info"] > p:nth-child(7)').text();
    let durasi = await $$('div[class="info"] > p:nth-child(9)').text();
    let tglrilis = await $$('div[class="info"] > p:nth-child(10)').text();
    let result360 = await JSON.stringify(links360).replace(/,/g, '\n').replace(/"/g, '').replace(/link360/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '');
    let result480 = await JSON.stringify(links480).replace(/,/g, '\n').replace(/"/g, '').replace(/link480/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '');
    let result720 = await JSON.stringify(links720).replace(/,/g, '\n').replace(/"/g, '').replace(/link720/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '');
    let result1080 = await JSON.stringify(links1080).replace(/,/g, '\n').replace(/"/g, '').replace(/link1080/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '');
    let thumb = $$('div[class="post-thumb"] > img').attr('src')
    let desk = $$('div[class="venser"]').find('div[class="lexot"]').children('p').first().text()
    let type  = $$(rootInfo.children('p').get(4)).text().split(':')[1].trim()
    let rate = $$(rootInfo.children('p').get(7)).text().split(':')[1].trim()
    let status = $$(rootInfo.children('p').get(5)).text().split(':')[1].trim()
    let producer = $$(rootInfo.children('p').get(3)).text().split(':')[1].trim()

    // Newsletter context info
    const _0x273817 = {
      'mentionedJid': [], // Empty since we don't have sender info here
      'forwardingScore': 0x3e7,
      'isForwarded': true,
      'forwardedNewsletterMessageInfo': {
        'newsletterJid': '120363420828095666@newsletter',
        'newsletterName': "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
        'serverMessageId': 0x8f
      }
    };

    resolve({ 
      judul, 
      thumb, 
      desk, 
      genre: genre.split(': ')[1], 
      status, 
      produser: producer, 
      rate, 
      type, 
      link: url, 
      total_eps: totaleps.split(': ')[1], 
      durasi: durasi.split(': ')[1], 
      tgl_rilis: tglrilis.split(': ')[1], 
      result: { 
        360: [...new Set(result360.replace(/:/g, '').replace(/https\/\//g, 'https://').split('\n'))], 
        480: [...new Set(result480.replace(/:/g, '').replace(/https\/\//g, 'https://').split('\n'))], 
        720: [...new Set(result720.replace(/:/g, '').replace(/https\/\//g, 'https://').split('\n'))], 
        1080: [...new Set(result1080.replace(/:/g, '').replace(/https\/\//g, 'https://').split('\n'))] 
      },
      contextInfo: _0x273817 // Adding the context info to the response
    })
  })
}

module.exports = { kuso, kuso2 }