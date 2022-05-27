import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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
  return (
    <>
      <header className={styles.Header}>
        <Header />
      </header>
      <div className={styles.Container}>
        <img src="/images/banner.png" alt="" />
        <div className={styles.ContainerWrapper}>
          <div className={styles.Content}>
            <h1>Criando um APP CRA do zero</h1>

            <div className={styles.Info}>
              <span>
                <FiCalendar size={20} color='#BBBBBB' />
                15 Mar 2022
              </span>

              <span>
                <FiUser size={20} color='#BBBBBB' />
                Ronnie Pettersonn
              </span>

              <span>
                <FiClock size={20} color='#BBBBBB' />
                4 min
              </span>
            </div>

            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quod labore, maiores illum veritatis aliquid modi necessitatibus facilis ea aut omnis et quibusdam numquam repudiandae deserunt. Voluptate harum nostrum explicabo.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quod labore, maiores illum veritatis aliquid modi necessitatibus facilis ea aut omnis et quibusdam numquam repudiandae deserunt. Voluptate harum nostrum explicabo.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient({});
//   const posts = await prismic.getByType(TODO);

//   // TODO
// };

// export const getStaticProps = async ({params }) => {
//   const prismic = getPrismicClient({});
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
