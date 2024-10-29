import { Layout } from "../features/layout/layout";
import { TutorialDB } from "../../server/dataAccess/tutorials/entity";
import { GetStaticProps } from "next";
import { TutorialList } from '../components/tutorialList/tutorialList';

const Tutorials = ({ title, description, tutorials, keywords, ...props }) => {
  return (
    <>
      <Layout
        pageTitle="Tutorials"
        description={description}
        slug="tutorials"
        keywords={keywords}
      >
        <TutorialList
          tutorials={tutorials}
        />
      </Layout>
    </>
  );
};

export default Tutorials;

export const getStaticProps: GetStaticProps = async ({ ...ctx }) => {

  // Fetch the tutorials
  const fetchedTutorials = await TutorialDB.getSiteTutorials();

  // Set up promises for fetching the tags
  const tagPromises = fetchedTutorials.map((tutorial) => TutorialDB.getTags(tutorial.id));
  const tagResults = await Promise.all(tagPromises);

  // Store them into each tutorial
  const tutorials = fetchedTutorials.map((tutorial, index) => {
    return {
      ...tutorial,
      tags: tagResults[index],
    };
  });


  const config = await import(`../../siteconfig.json`);

  return {
    props: {
      title: config.default.title,
      description: `Tutorials on the latest in JavaScript, TypeScript, NodeJS, and more.`,
      tutorials,
      keywords: config.default.keywords,
    },
    revalidate: 1,
  };
};
