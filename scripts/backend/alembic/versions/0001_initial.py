"""Initial schema
Revision ID: 000000000001
Revises: 
Create Date: 2025-12-27 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
import sqlalchemy.types as types

# revision identifiers, used by Alembic.
revision = '000000000001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False, index=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=64), nullable=False, server_default='user'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.UniqueConstraint('email')
    )

    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('department', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('salary_min', sa.Integer, nullable=True),
        sa.Column('salary_max', sa.Integer, nullable=True),
        sa.Column('currency', sa.String(length=8), nullable=False, server_default='INR'),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_index(op.f('ix_jobs_id'), 'jobs', ['id'], unique=False)

    op.create_table(
        'applications',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('job_id', sa.Integer, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=32), nullable=True),
        sa.Column('resume_url', sa.Text, nullable=True),
        sa.Column('cover_letter', sa.Text, nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ),
    )

    op.create_index(op.f('ix_applications_id'), 'applications', ['id'], unique=False)

    op.create_table(
        'contractors',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('specialty', sa.String(length=255), nullable=True),
        sa.Column('avatar_url', sa.Text, nullable=True),
    )

    op.create_index(op.f('ix_contractors_id'), 'contractors', ['id'], unique=False)

    op.create_table(
        'contractor_reviews',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('contractor_id', sa.Integer, nullable=False),
        sa.Column('author_name', sa.String(length=255), nullable=False),
        sa.Column('rating', sa.Integer, nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['contractor_id'], ['contractors.id'], ),
    )

    op.create_index(op.f('ix_contractor_reviews_id'), 'contractor_reviews', ['id'], unique=False)

    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('project_id', sa.Integer, nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('status', sa.String(length=64), nullable=False, server_default='todo'),
        sa.Column('assignee_name', sa.String(length=255), nullable=True),
        sa.Column('due_date', sa.String(length=32), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_index(op.f('ix_tasks_id'), 'tasks', ['id'], unique=False)

    op.create_table(
        'members',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=255), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_index(op.f('ix_members_id'), 'members', ['id'], unique=False)

    op.create_table(
        'messages',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('to_user', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_index(op.f('ix_messages_id'), 'messages', ['id'], unique=False)

    op.create_table(
        'projects',
        sa.Column('id', sa.Integer, primary_key=True, nullable=False),
        sa.Column('user_id', sa.Integer, nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('status', sa.String(length=64), nullable=False, server_default='planning'),
        sa.Column('budget', sa.Numeric(15, 2), nullable=True),
        sa.Column('deadline', sa.String(length=32), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    )

    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)


def downgrade():
    op.drop_table('projects')
    op.drop_table('messages')
    op.drop_table('members')
    op.drop_table('tasks')
    op.drop_table('contractor_reviews')
    op.drop_table('contractors')
    op.drop_table('applications')
    op.drop_table('jobs')
    op.drop_table('users')
