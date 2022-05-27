import { GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../components/Header';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi'

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type } from 'os';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [results, setResults] = useState([])
  const [showButton, setShowButton] = useState('')

  useEffect(() => {
    const resultsUpdated = postsPagination.results
    setShowButton(postsPagination.next_page)

    setResults(resultsUpdated)

  }, [])

  async function handleNextPage(url: string) {
    const response = await fetch(url).then(data => data.json()).then(response => response)

    let getNextPage = response.results

    const resultsUpdated = results

    const newResultsUpdated = [...resultsUpdated, ...getNextPage]

    const setTeste = new Set()

    const testeFilter = newResultsUpdated.filter(i => {
      const duplicate = setTeste.has(i.id)
      setTeste.add(i.id)
      return !duplicate
    })

    if (showButton) {
      setResults(testeFilter)
      setShowButton(response.next_page)
    } else {
      return
    }
  }


  return (
    <>
      <header className={styles.Header}>
        <Head>
          <title>Teste de titulo</title>
        </Head>
      </header>
      <Header />
      <div className={styles.Container}>
        <div className={styles.ContainerWrapper}>


          {
            results.map(post => (

              <div className={styles.Post} key={post.uid}>
                <Link href={`/post/${post.uid}`} >
                  <a >
                    <h1>{post.data.title}</h1>
                    <span>{post.data.subtitle}</span>

                    <div className={styles.Info}>
                      <span className={styles.date}>
                        <FiCalendar size={20} color='#BBBBBB' />
                        {
                          format(
                            new Date(post.first_publication_date),
                            'dd MMM yyyy',
                            {
                              locale: ptBR
                            }
                          )
                        }
                      </span>
                      <span>
                        <FiUser size={20} color='#BBBBBB' />
                        {post.data.author}
                      </span>
                    </div>
                  </a>
                </Link>

              </div>

            ))
          }

          {
            showButton ? (<button type='button' onClick={() => handleNextPage(showButton)}>Carregar mais posts</button>) : null
          }
        </div>

      </div>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 1 });

  const postsPagination = postsResponse

  return {
    props: {
      postsPagination
    }
  }
};
