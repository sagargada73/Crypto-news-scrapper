const port = process.env.PORT||8000;
const axios = require('axios')
const cheerio = require('cheerio');
const e = require('express');
const express = require('express')
const app = express();
const articles = []

const info=[
        {
        How_To_Use:'Use Name for specific searches using forward slash',
        Example:'/CoinDCX'
    },
]
const searchList = [
    {
        name: 'CoinDCX',
        url: 'https://www.coindesk.com/',
        base:'https://www.coindesk.com/'
    },
    // {
    // name: 'Bloomberg',
    // url: 'https://www.bloomberg.com/crypto',
    // base:'https://www.bloomberg.com/crypto'
    // }
    {
        name: 'Economic-Times',
        url: 'https://economictimes.indiatimes.com/markets/cryptocurrency',
        base:'https://economictimes.indiatimes.com/markets/cryptocurrency'
    },

]

searchList.forEach((search)=>{
    axios.get(search.url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('a:contains("Bitcoin")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            articles.push({
                title,
                url:search.base+url,
                source:search.name
             })
        })
    })
        .catch((err) => {
            console.log(err)
        })
})


app.get('/', (req, res) => {
    const output = [...info, ...searchList];
    res.json(output)
})
app.get('/:name',(req,res)=>{
    const search = req.params.name;
    // function filterByName(articles) {
    //     console.log(search)
    //     if (search===articles.source) {
    //       return true
    //     }else{
    //         return false;
    //     }
    //   }
    // const specificArticles=articles.filter(filterByName);
    const specificArticles=articles.filter(name=>name.source==search);
    res.json(specificArticles)
})
app.listen(port, (req, res) => {
    console.log(`Server started on ${port}`)
})