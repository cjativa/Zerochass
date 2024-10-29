import { GetStaticProps } from "next";

import { TutorialDB } from "../../server/dataAccess/tutorials/entity";
import { Layout } from "../features/layout/layout";
import { Landing } from "../features/landing/landing";

const Index = ({ title, description, tutorials, keywords, ...props }) => {
  const pageTitle = `Home`;

  return (
    <Layout
      pageTitle={pageTitle}
      description={description}
      keywords={keywords}
      slug=""
    >
      <Landing tutorials={tutorials} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ ...ctx }) => {
  const tutorials = await TutorialDB.listTutorials();
  const config = await import(`../../siteconfig.json`);

  return {
    props: {
      title: config.default.title,
      description: config.default.description,
      tutorials,
      keywords: config.default.keywords,
    },
  };
};

export default Index;
