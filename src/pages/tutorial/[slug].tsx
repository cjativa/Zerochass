import { GetServerSideProps } from "next";

import { Layout } from "../../features/layout/layout";
import { Tutorial } from "../../features/tutorial/tutorial";
import { TutorialDB } from "../../../server/dataAccess/tutorials/entity";
import { TutorialSectionDB } from "../../../server/dataAccess/tutorialSection/entity";
import { PlannerDB } from '../../../server/dataAccess/planner/entity';
import { UserDB } from '../../../server/dataAccess/user/entity';

export interface TutorialMetrics {
  totalRegisteredCount: number,
  totalComments?: number,
};


const TutorialPage = ({ tutorial, author }) => {
  const { tags, description1, description2, featuredImage, slug } = tutorial;

  const keywords = tags.map((tag) => tag.title).join();
  const descriptions = `${description1} ${description2}`;

  return (
    <Layout
      pageTitle={tutorial.title}
      description={descriptions}
      keywords={keywords}
      slug={`tutorial/${slug}`}
      image={featuredImage}
      large={true}
    >
      <Tutorial
        tutorial={tutorial}
        author={author}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ ...ctx }) => {
  const slug = ctx.params.slug as string;
  const config = await import(`../../../siteconfig.json`);

  const tutorialMain = await TutorialDB.findTutorial("slug", slug);
  const sections = await TutorialSectionDB.listTutorialSections(tutorialMain.id);
  const tags = await TutorialDB.getTags(tutorialMain.id);

  const tutorial = {
    ...tutorialMain,
    tags,
    sections
  };

  const author = await UserDB.getUserInformation(tutorialMain.userId);

  const tutorialMetrics = {
    tutorialRegisteredCount: await PlannerDB.getRegisteredCount(tutorialMain.id),
    // totalComments: await  
  };

  return {
    props: {
      siteTitle: config.title,
      tutorial,
      author
    },
  };
};

export default TutorialPage;
