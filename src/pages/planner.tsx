import { Layout } from "../features/layout/layout";
import { Planner } from "../features/planner/planner";
import { PlannerDB } from "../../server/dataAccess/planner/entity";

const PlannerPage = ({ tutorials }) => {
  return (
    <Layout pageTitle={"Planner"}>
      <Planner tutorials={tutorials} />
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const protectPageWithAuthentication = (
    await import("../../server/api/middleware/protectedPage")
  ).default;
  await protectPageWithAuthentication(ctx);

  const { userId } = ctx.req;
  const tutorials = await PlannerDB.retrieveTutorials(userId);

  return {
    props: {
      tutorials,
    }, // will be passed to the page component as props
  };
};

export default PlannerPage;
