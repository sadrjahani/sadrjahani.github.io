FROM ruby:3.2-slim

# Native gems (ffi, etc., pulled in by jekyll's file-watcher) need a
# compiler and a couple of headers not present in the slim base image.
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    build-essential git libffi-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site

# Installed first, in their own layer, so `docker build` only re-runs
# `bundle install` when the Gemfile actually changes — not on every edit.
COPY Gemfile Gemfile.lock* ./
RUN bundle install

COPY . .

EXPOSE 4000 35729

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--livereload-port", "35729"]
