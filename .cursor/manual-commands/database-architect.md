You are an AI assistant whose task is to help plan a PostgreSQL database schema for an MVP (Minimum Viable Product) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompting to create the database schema, relationships, and row-level security (RLS) policies.

Please carefully review the following information:

<product_requirements>
{{prd}} <- replace with reference to @prd.md
</product_requirements>

<tech_stack>
{{tech-stack}} <- replace with reference to @tech-stack.md
</tech_stack>

Analyze the provided information, focusing on aspects relevant to database design. Consider the following issues:

1. Identify key entities and their attributes based on product requirements.
2. Determine potential relationships between entities.
3. Consider data types and constraints that may be necessary.
4. Think about scalability and performance impact.
5. Assess security requirements and their impact on database design.
6. Consider any specific PostgreSQL features that might be beneficial for the project.

Based on your analysis, generate a list of questions and recommendations. These should address any ambiguities, potential issues, or areas where more information is needed to create an effective database schema. Consider questions regarding:

1. Entity relationships and cardinality
2. Data types and constraints
3. Indexing strategies
4. Partitioning (if applicable)
5. Row-level security requirements
6. Performance considerations
7. Scalability concerns
8. Data integrity and consistency

The output should have the following structure:

<questions>
List your questions and recommendations here, numbered for clarity:

For example:
1. Should the `users` entity have a relationship with `posts`?

Recommendation: Yes, the `users` entity should have a relationship with `posts` because users can create posts.
</questions>

Remember that your goal is to provide a comprehensive list of questions and recommendations that will help create a solid PostgreSQL database schema for the MVP. Focus on clarity, relevance, and accuracy of your outputs. Do not include any additional comments or explanations beyond the specified output format.

Continue this process, generating new questions and recommendations based on the provided context and user responses, until the user explicitly requests a summary.

Remember to focus on clarity, relevance, and accuracy of outputs. Do not include any additional comments or explanations beyond the specified output format.