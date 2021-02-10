import { Layout } from "../../components/Layout";
import { Write } from "../../components/write/write";
import { TutorialDB } from "../../../server/dataAccess/tutorials/entity";
import { TutorialSectionDB } from '../../../server/dataAccess/tutorialSection/entity';

const WritePage = ({ pageTitle, edit, tutorial }) => {
  return (
    <Layout pageTitle={pageTitle}>
      <Write edit={edit} tutorial={tutorial} />
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const protectPageWithAuthentication = (
    await import("../../../server/api/middleware/protectedPage")
  ).default;
  await protectPageWithAuthentication(ctx);

  const { userId } = ctx.req;
  let tutorial = {};
  let pageTitle = 'New Tutorial';



  // If there's a id present in the url, then we're editing an existing
  // tutorial rather than creating a new one
  const edit = (ctx.params.id)
    ? true
    : false
    ;

  if (edit) {
    pageTitle = "Edit Tutorial";

    // Fetch the whole tutorial
    const tutorialId = ctx.params.id[0];
    const tutorialMain = (await TutorialDB.getTutorialForEditing(userId, tutorialId)).shift();
    const sections = await TutorialSectionDB.listTutorialSections(tutorialId);
    const tags = await TutorialDB.getTags(tutorialId);

    tutorial = {
      ...tutorialMain,
      tags,
      sections
    };
  }


  return {
    props: {
      pageTitle,
      edit,
      tutorial,
    }
  };
};

export default WritePage;
