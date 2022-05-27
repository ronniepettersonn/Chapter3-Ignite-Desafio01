import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import * as prismicH from '@prismicio/helpers'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const totalPostWords = post.data.content.reduce((acc, item) => {
    const heading = item.heading.trim().split(' ').length;
    const body = item.body.reduce((accumulator, { text }) => {
      return (accumulator += text.trim().split(' ').length);
    }, 0);

    return (acc += heading + body);
  }, 0);

  const minutesToReadThePost = Math.ceil(totalPostWords / 200);

  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Carregando...</p>
  }

  return !post ? (<p>Carregando...</p>) : (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>

      <section className={styles.Header}>
        <Header />
      </section>

      <div className={styles.Container}>

        <img src={post?.data.banner.url} alt="banner" />
        <div className={styles.ContainerWrapper}>
          <div className={styles.Content}>
            <h1>{post.data.title}</h1>

            <div className={styles.Info}>
              <span>
                <FiCalendar size={20} color='#BBBBBB' />
                {format(
                  new Date(post.first_publication_date),
                  'dd MMM yyyy',
                  {
                    locale: ptBR
                  }
                )}
              </span>

              <span>
                <FiUser size={20} color='#BBBBBB' />
                {post.data.author}
              </span>

              <span>
                <FiClock size={20} color='#BBBBBB' />
                {
                  minutesToReadThePost
                } min
              </span>
            </div>

            <div>
              {

                post.data.content.map(({ heading, body }) => {
                  return (
                    <div key={heading} className={styles.heading_content}>
                      <h3>{heading}</h3>
                      {body.map(({ text }, index) => (
                        <p key={index}>{text}</p>
                      ))}
                    </div>
                  );
                })
              }
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', { lang: 'pt-BR' });

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    }
  })

  return {
    paths,
    fallback: true
  }

  // TODO
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      content: response.data.content
    }
  }

  // TODO
  return {
    props: { post },
    redirect: 60 * 30
  }
};
