import Head from 'next/head'
import Meta from '@hackclub/meta'
import useSWR from 'swr'
import Masonry from 'react-masonry-css'
import Post from '../components/post'

const Header = () => (
  <>
    <Meta
      as={Head}
      name="Summer Scrapbook"
      title="Summer Scrapbook"
      description="See everything the Hack Club community is making this summer."
      image="https://workshop-cards.hackclub.com/Summer%20Scrapbook.png?brand=Scrapbook&fontSize=300px"
    />
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Shrikhand&display=swap"
        rel="stylesheet"
      />
    </Head>
    <header>
      <h1>Hack Club’s Summer Scrapbook</h1>
      <p>
        Daily updates from <a href="https://hackclub.com/">Hack Clubbers</a>{' '}
        learning & making something new every day.
      </p>
    </header>
    <style jsx global>{`
      @media (prefers-color-scheme: dark) {
        :root {
          --colors-text: var(--colors-snow);
        }
      }
    `}</style>
    <style jsx>{`
      header {
        text-align: center;
        padding: 0 0 48px;
      }
      h1 {
        color: var(--colors-orange);
        font-family: var(--fonts-display);
        margin: 0;
        font-size: 36px;
        line-height: 1;
      }
      p {
        font-size: 16px;
        color: var(--colors-text);
      }
      @media (min-width: 32em) {
        h1 {
          font-size: 48px;
        }
        p {
          font-size: 24px;
        }
        header {
          padding: 24px 0 48px;
        }
      }
      @media (min-width: 48em) {
        h1 {
          font-size: 64px;
        } 
      }
      a {
        color: var(--colors-orange);
        text-decoration: none;
      }
      a:hover,
      a:focus {
        text-decoration: underline;
        text-decoration-style: wavy;
        text-underline-position: under;
      }
      @supports (-webkit-background-clip: text) {
        h1 {
          background-image: radial-gradient(
            ellipse farthest-corner at top left,
            var(--colors-yellow),
            var(--colors-orange)
          );
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    `}</style>
  </>
)

const fetcher = url => fetch(url).then(r => r.json())

export default ({ initialData }) => {
  const { data, error } = useSWR('/api/posts', fetcher, {
    initialData,
    refreshInterval: 5000
  })

  if (error) {
    return (
      <main className="container">
        <Header />
        <p>Unable to get posts. Check your connection?</p>
        <style jsx>{`
          p {
            text-align: center;
            font-size: 20px;
          }
        `}</style>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="container">
        <Header />
        <p>Loading…</p>
        <pre>{JSON.stringify(data)}</pre>
        <style jsx>{`
          p {
            text-align: center;
            font-size: 20px;
          }
        `}</style>
      </main>
    )
  }

  return (
    <main>
      <Header />
      <Masonry
        breakpointCols={{
          default: 4,
          1100: 3,
          700: 2,
          500: 1
        }}
        className="masonry-posts"
        columnClassName="masonry-posts-column"
      >
        {data.map(post => (
          <Post key={post.id} {...post} />
        ))}
      </Masonry>
      <style jsx global>{`
        h1 {
          padding: 16px;
        }

        .masonry-posts {
          display: flex;
          width: 100%;
          max-width: 100%;
        }

        .masonry-posts-column {
          background-clip: padding-box;
        }

        .post {
          margin-bottom: 1px;
        }
        
        @media (min-width: 32em) {
          .masonry-posts {
            padding-right: 24px;
          }
          
          .masonry-posts-column {
            padding-left: 24px;
          }
          
          .post {
            border-radius: 12px;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </main>
  )
}

export const getStaticProps = async () => {
  const { getPosts } = require('./api/posts')
  const initialData = await getPosts()
  return { props: { initialData }, unstable_revalidate: 1 }
}
