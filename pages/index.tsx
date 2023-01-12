/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import GitHubCalendar from 'react-github-calendar';
import ReactMarkdown from 'react-markdown'

interface Node {
  node:{
      name:string,
      description:string,
      homepageUrl:string,
      openGraphImageUrl:string,
      url:string
      object:{
          text:any
      }
    }
  }

export default function Home() {

  const [imgUrl, setImgUrl] = useState('');
  const [repositoriesInfo, setRepositoriesInfo] = useState([]);
  const [pageView, setPageView] = useState(1)
  const [name, setName] = useState<Node | undefined>()

  useEffect(() => {
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
        {
          user(login: "Rihkar") {
            avatarUrl
            pinnedItems(first: 6) {
              edges {
                node {
                  ... on Repository {
                    object(expression: "master:README.md") {
                      ... on Blob {
                        text
                      }
                    }
                    openGraphImageUrl
                    description
                    homepageUrl
                    name
                    url
                  }
                }
              }
            }
          }
        }
              `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        
        setImgUrl(data.data.user.avatarUrl);
        setRepositoriesInfo(data.data.user.pinnedItems.edges);
      })
      .catch((err) => console.log('err', err));
  }, []);




  return (
    <div className="container">
      <h1 className="title">Rihards Karlauskis - Portfolio</h1>  
    <h3 className='personal-sites'>   
      <a className='personal-site' onClick={()=>setPageView(1)}>Main Page</a>
      <a className='personal-site' target="_blank" href="https://www.linkedin.com/in/rihards-hanriot-karlauskis/" rel="noreferrer">LinkedIn </a>
      <a className='personal-site' target="_blank" href="https://github.com/Rihkar" rel="noreferrer">GitHub</a>
    </h3>
      {pageView === 1 ? <div className="container"> 
  
    <div className="calendar-and-img">
      <img className="my-img" src={imgUrl} alt="img" />
      <div className="calendar"><GitHubCalendar username="Rihkar" /></div>
    </div>

    <div className="project-wrapper">
      {repositoriesInfo.map((node:Node) => (
        <div className="project" key={node.node.url}>
          <div className="project-name-and-more-info">
            <h3>{node.node.name}</h3>
            <a className='link' onClick={()=>{setPageView(2), setName(node)}} >More info</a>
          </div>
          <h4>
            {node.node.description}
          </h4>
          <img className="project-img" src={node.node.openGraphImageUrl} alt="img" />
        </div>
      ))}
    </div></div> : 
   
     <div className='see-more-container'>
      <div >
        <h1 >{name?.node.name}</h1>
      <h2 >{name?.node.description}</h2>
      <a className='see-more-link' target="_blank" href={name?.node.url}rel="noreferrer" >Click here to View Project in GitHub</a>
      {name?.node.homepageUrl && (
          <div>
            <a className='see-more-link' target="_blank" href={name?.node.homepageUrl} rel="noreferrer">Click here to Visit the App</a>
          </div>
          )}
      <ReactMarkdown >{name?.node.object.text}</ReactMarkdown>
      </div>
      
            
      </div> 
    
     }
   
  </div>  )
}
