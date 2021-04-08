import ReactMarkdown from 'react-markdown';

import { Layout } from '../components/layout';
import { CraftQL } from '../util/services/craftGQL';
import { singlesQuery } from '../util/queries/singlesQuery';

const About = ({ title, slug, entryContent, description, keywords }) => {

    let fullKeywords = ['company', 'contact', 'information', ...keywords].join();

    return (
        <Layout pageTitle={title} description={description} keywords={fullKeywords} slug={slug}>
            <div className="about single-page">
                {entryContent &&
                    <div className="body">
                        {entryContent.map((block, index) => {
                            return (
                                <div key={index} className="section-content">
                                    <h1 className="title">{block.sectionTitle}</h1>
                                    <ReactMarkdown source={block.sectionContent} linkTarget="_blank" />
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        </Layout>
    )
};

export async function getStaticProps() {
    const about = (await CraftQL(singlesQuery('about')))[0];
    let { slug, entryContent, description } = about;
    description = entryContent && entryContent.map((e, i) => {
        if (i == 0) return `${e.sectionTitle} ${e.sectionContent}`.replace(/<[^>]*>/g, '')
    }).join(' ').trim();

    const config = await import(`../../siteconfig.json`);

    return {
        props: {
            title: 'About',
            slug,
            entryContent,
            description,
            keywords: config.default.keywords
        },
    }
};


export default About;
