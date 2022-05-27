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
import { useState } from 'react';

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
  const [results, setResults] = useState(postsPagination)
  const [showButton, setShowButton] = useState(!!postsPagination.next_page)

  async function handleNextPage(url: string) {
    await fetch(url).then(data => data.json()).then(response => {
      const newPosts = { ...results }

      setResults({
        ...newPosts,
        next_page: response.next_page,
        results: [...newPosts.results, ...response.results]
      })
      setShowButton(!!response.next_page)

    })
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
            results.results.map(post => (

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
            showButton ? (<button type='button' onClick={() => handleNextPage(results.next_page)}>Carregar mais posts</button>) : null
          }
        </div>

      </div>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 1, lang: 'pt-BR' });

  const postsPagination = { ...postsResponse }

  return {
    props: {
      postsPagination
    }
  }
};
